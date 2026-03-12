import { NextResponse } from "next/server";
import { airtableBase } from "@/lib/airtable";
import { getAuthUser } from "@/lib/auth";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let profileData = null;

    // 1. Obtener Perfil Financiero
    try {
      const identifiers = [user.id, user.customId].filter(val => val && val !== 'undefined');
      const profileFormula = `OR(${identifiers.map(id => `{UserId} = '${id}'`).join(',')}, ${identifiers.map(id => `FIND('${id}', {UserId})`).join(',')})`;

      const profiles = await airtableBase("FinancialProfiles")
        .select({ filterByFormula: profileFormula })
        .firstPage();

      if (profiles.length > 0) {
        profileData = profiles[0].fields;
      }
    } catch (err: any) {
      console.error("Error en tabla FinancialProfiles:", err.message);
    }

    if (!profileData) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    // 2. Obtener Historial de Insights
    let allInsights: any[] = [];
    try {
      // Buscamos por el campo UserId (que ahora es el estándar en Airtable)
      // Soporta tanto el ID interno de Airtable como el Custom ID (hash)
      const insightFormula = `OR({UserId} = '${user.id}', {UserId} = '${user.customId}', FIND('${user.id}', {UserId}), FIND('${user.customId}', {UserId}))`;
      console.log(`[GET financial-profile] Buscando insights en tabla AIInsights con formula: ${insightFormula}`);

      const insights = await airtableBase("AIInsights")
        .select({
          filterByFormula: insightFormula,
          sort: [{ field: "Date", direction: "desc" }],
        })
        .firstPage();

      allInsights = insights.map(r => {
        const fields = r.fields;

        // Mapeo de niveles de riesgo de inglés a español
        const riskMap: Record<string, string> = {
          'low': 'Bajo',
          'medium': 'Medio',
          'high': 'Alto'
        };
        const rawRisk = (fields.RiskLevel as string || "").toLowerCase();
        const riskLevel = riskMap[rawRisk] || fields.RiskLevel || "Medio";

        // Procesar recomendaciones (ahora son objetos {action, priority, impact})
        let recommendations: any[] = [];
        const rawRecs = fields.Recommendations as string;
        if (rawRecs) {
          try {
            // Intentar parsear como JSON
            if (rawRecs.trim().startsWith('[') || rawRecs.trim().startsWith('{')) {
              let normalizedJson = rawRecs.trim();
              if (normalizedJson.startsWith('{') && !normalizedJson.startsWith('[')) {
                normalizedJson = '[' + normalizedJson.replace(/\}\s*\{/g, '},{') + ']';
              }
              const parsed = JSON.parse(normalizedJson);
              const items = Array.isArray(parsed) ? parsed : [parsed];
              recommendations = items.map(item => ({
                action: item.action || (typeof item === 'string' ? item : 'Acción no especificada'),
                priority: (item.priority || 'medium').toLowerCase(),
                impact: item.impact || 'Mejora financiera'
              }));
            } else {
              // Fallback a texto plano
              recommendations = rawRecs.split("\n").filter(Boolean).map(line => ({
                action: line.replace(/^[•\-\*]\s*/, ""),
                priority: "medium",
                impact: "Mejora financiera"
              }));
            }
          } catch (e) {
            recommendations = rawRecs.split("\n").filter(Boolean).map(line => ({
              action: line.replace(/^[•\-\*]\s*/, ""),
              priority: "medium",
              impact: "Mejora financiera"
            }));
          }
        }

        // Procesar Insights (resumen con puntos)
        let summaryPoints: string[] = [];
        const rawInsights = fields.Insights as string;
        if (rawInsights) {
          try {
            if (rawInsights.trim().startsWith('{')) {
              let normalizedInsights = rawInsights.trim();
              if (normalizedInsights.startsWith('{') && !normalizedInsights.startsWith('[')) {
                normalizedInsights = '[' + normalizedInsights.replace(/\}\s*\{/g, '},{') + ']';
              }
              const parsed = JSON.parse(normalizedInsights);
              const items = Array.isArray(parsed) ? parsed : [parsed];
              summaryPoints = items.map(item => item.text || (typeof item === 'string' ? item : '')).filter(Boolean);
            } else {
              summaryPoints = rawInsights.split(/\. |\n/).filter(p => p.trim().length > 0).map(p => p.trim());
            }
          } catch (e) {
            summaryPoints = rawInsights.split(/\. |\n/).filter(p => p.trim().length > 0).map(p => p.trim());
          }
        }

        return {
          id: r.id,
          healthScore: fields.HealthScore,
          riskLevel,
          summaryPoints,
          recommendations,
          Date: fields.Date,
          type: "ai_insight"
        };
      });
      console.log(`[GET financial-profile] Mapping completado para ${allInsights.length} insights`);
    } catch (err: any) {
      console.error("Error en tabla AIInsights:", err.message);
    }

    // 3. Verificar si hay trabajos de IA pendientes
    let hasActiveJob = false;
    let latestJobStatus = null;
    try {
      const jobFormula = `OR({UserId} = '${user.id}', {UserId} = '${user.customId}', FIND('${user.id}', {UserId}), FIND('${user.customId}', {UserId}))`;
      const jobs = await airtableBase("AIJobs")
        .select({
          filterByFormula: jobFormula,
          sort: [{ field: "CreatedAt", direction: "desc" }],
          maxRecords: 1
        })
        .firstPage();

      if (jobs.length > 0) {
        const job = jobs[0];
        const status = ((job.fields.Status as string) || "").toLowerCase();
        latestJobStatus = status;

        // Verificar si el trabajo está "atascado" (más de 15 minutos en pending/processing)
        // Intentar obtener la fecha de creación de varias fuentes: campo CreatedAt, campo createdTime, o metadato del registro
        const rawDate = job.fields.CreatedAt || job.fields.createdTime || (job as any)._rawJson?.createdTime;
        const jobDate = rawDate ? new Date(rawDate as string) : new Date();
        const now = new Date();
        const diffMinutes = (now.getTime() - jobDate.getTime()) / (1000 * 60);

        console.log(`[AIJobs] Último trabajo: ${status}, creado hace ${diffMinutes.toFixed(1)} mins`);

        if ((status === "pending" || status === "processing") && diffMinutes < 15) {
          hasActiveJob = true;
        }
      }
    } catch (err: any) {
      console.error("Error en tabla AIJobs:", err.message);
    }

    return NextResponse.json({
      profile: profileData,
      insight: allInsights.length > 0 ? allInsights[0] : null,
      allInsights: allInsights,
      hasActiveJob,
      latestJobStatus
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error global en GET financial-profile:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      monthlyIncome,
      monthlyExpenses,
      currentSavings,
      mortgageAmount,
      mortgageInterest,
      mortgageYearsRemaining,
      loanAmount,
      loanInterest,
      loanYearsRemaining,
      children,
      financialGoal,
    } = body;

    // 1. Buscar si ya existe para actualizar
    const searchFormula = `OR({UserId} = '${user.id}', {UserId} = '${user.customId}', FIND('${user.id}', {UserId}), FIND('${user.customId}', {UserId}))`;
    const existingRecords = await airtableBase("FinancialProfiles")
      .select({
        filterByFormula: searchFormula,
      })
      .firstPage();

    const fields: any = {
      UserId: [user.id],
      MonthlyIncome: Number(monthlyIncome),
      MonthlyExpenses: Number(monthlyExpenses),
      CurrentSavings: Number(currentSavings),
      MortgageAmount: Number(mortgageAmount || 0),
      MortgageInterest: Number(mortgageInterest || 0),
      MortgageYearsRemaining: Number(mortgageYearsRemaining || 0),
      LoanAmount: Number(loanAmount || 0),
      LoanInterest: Number(loanInterest || 0),
      LoanYearsRemaining: Number(loanYearsRemaining || 0),
      Children: Number(children),
      FinancialGoal: financialGoal,
    };

    if (existingRecords.length > 0) {
      await airtableBase("FinancialProfiles").update([
        {
          id: existingRecords[0].id,
          fields,
        },
      ]);
    } else {
      // Generar un ID único para el perfil
      const generatedProfileId = createHash("md5")
        .update(user.customId + "_profile_" + Date.now())
        .digest("hex")
        .substring(0, 12);

      fields.Id = generatedProfileId;

      await airtableBase("FinancialProfiles").create([
        {
          fields,
        },
      ]);
    }

    // 2. Crear un AIJob para recalcular insights
    const jobId = createHash("md5")
      .update(user.customId + "_profile_job_" + Date.now())
      .digest("hex")
      .substring(0, 12);

    await airtableBase("AIJobs").create([
      {
        fields: {
          Id: jobId,
          UserId: [user.id],
          JobType: existingRecords.length > 0 ? "periodic_update" : "initial_analysis",
          Status: "pending",
          Payload: JSON.stringify(fields),
          CreatedAt: new Date().toISOString()
        }
      }
    ]);

    return NextResponse.json({ message: "Perfil guardado con éxito. Análisis en cola." }, { status: 200 });
  } catch (error: any) {
    console.error("Error saving financial profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
