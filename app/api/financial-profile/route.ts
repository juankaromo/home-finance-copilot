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
      const insightFormula = `OR({UserId} = '${user.id}', {UserId} = '${user.customId}', FIND('${user.id}', {UserId}), FIND('${user.customId}', {UserId}))`;

      const insights = await airtableBase("AIInsights")
        .select({
          filterByFormula: insightFormula,
          sort: [{ field: "Date", direction: "desc" }],
        })
        .firstPage();

      allInsights = insights.map(r => ({
        id: r.id,
        healthScore: r.fields.HealthScore,
        riskLevel: r.fields.RiskLevel,
        recommendations: (r.fields.Recommendations as string || "").split("\n").filter(Boolean),
        Date: r.fields.Date,
        type: "ai_insight"
      }));
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
        const status = jobs[0].fields.Status as string;
        latestJobStatus = status;
        if (status === "pending" || status === "processing") {
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
