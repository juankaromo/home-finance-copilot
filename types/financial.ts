export interface FinancialProfile {
    UserId: string;
    MonthlyIncome: number;
    MonthlyExpenses: number;
    CurrentSavings: number;
    MortgageAmount: number;
    MortgageInterest: number;
    MortgageYearsRemaining: number;
    LoanAmount: number;
    LoanInterest: number;
    LoanYearsRemaining: number;
    Children: number;
    FinancialGoal: string;
}

export interface AIAnalysis {
    healthScore: number;
    riskLevel: "Bajo" | "Medio" | "Alto";
    recommendations: string[];
}
