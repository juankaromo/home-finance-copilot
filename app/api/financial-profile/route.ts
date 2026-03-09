import { NextResponse } from "next/server";
import { airtableBase } from "@/lib/airtable";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let profileData = null;
    let latestInsight = null;

    // 1. Obtener Perfil Financiero
    try {
      // Para mayor robustez, buscamos por ID, Email o Nombre caso de que 
      // la columna primaria de Users no sea el ID.
      const profileFormula = `OR(
        FIND('${user.id}', {UserId}),
        FIND('${user.email}', {UserId}),
        FIND('${user.name}', {UserId})
      )`;

      const profiles = await airtableBase("FinancialProfiles")
        .select({ filterByFormula: profileFormula })
        .firstPage();

      if (profiles.length > 0) {
        profileData = profiles[0].fields;
      }
    } catch (err: any) {
      console.error("Error en tabla FinancialProfiles:", err.message);
      return NextResponse.json({
        error: "Error en tabla FinancialProfiles",
        details: err.message
      }, { status: 500 });
    }

    if (!profileData) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    // 2. Obtener Último Insight
    try {
      const insightFormula = `OR(
        FIND('${user.id}', {UserId}),
        FIND('${user.email}', {UserId}),
        FIND('${user.name}', {UserId})
      )`;
      const insights = await airtableBase("AIInsights")
        .select({
          filterByFormula: insightFormula,
          sort: [{ field: "Date", direction: "desc" }],
          maxRecords: 1,
        })
        .firstPage();

      if (insights.length > 0) {
        latestInsight = {
          healthScore: insights[0].fields.HealthScore,
          riskLevel: insights[0].fields.RiskLevel,
          recommendations: (insights[0].fields.Recommendations as string || "").split("\n").filter(Boolean),
          date: insights[0].fields.Date,
        };
      }
    } catch (err: any) {
      console.error("Error en tabla AIInsights:", err.message);
    }

    return NextResponse.json({
      profile: profileData,
      insight: latestInsight
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

    // 1. Buscar si ya existe para actualizar (Usando criterios múltiples para robustez)
    const existingRecords = await airtableBase("FinancialProfiles")
      .select({
        filterByFormula: `OR(
          FIND('${user.id}', {UserId}),
          FIND('${user.email}', {UserId}),
          FIND('${user.name}', {UserId})
        )`,
      })
      .firstPage();

    const fields = {
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
      // Actualizar
      await airtableBase("FinancialProfiles").update([
        {
          id: existingRecords[0].id,
          fields,
        },
      ]);
    } else {
      // Crear
      await airtableBase("FinancialProfiles").create([
        {
          fields,
        },
      ]);
    }

    return NextResponse.json({ message: "Perfil guardado con éxito" }, { status: 200 });
  } catch (error: any) {
    console.error("Error saving financial profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
