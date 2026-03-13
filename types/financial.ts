export interface FinancialProfile {
    UserId: string;
    MonthlyIncome: number;
    MonthlyExpenses: number;
    CurrentSavings: number;
    MortgageInitialAmount: number;
    MortgageCurrentAmount: number;
    MortgageInterest: number;
    MortgageEndDate: string;
    LoanInitialAmount: number;
    LoanCurrentAmount: number;
    LoanInterest: number;
    LoanEndDate: string;
    Children: number;
    FinancialGoal: string;
}

export interface AIRecommendation {
    action: string;
    priority: "high" | "medium" | "low";
    impact: string;
}

export interface AIAnalysis {
    healthScore: number;
    riskLevel: "Bajo" | "Medio" | "Alto";
    summaryPoints?: string[];
    recommendations: AIRecommendation[];
    Date: string;
}

export type FinancialEventType = "amortization" | "extra_income" | "unexpected_expense" | "goal_reached" | "other";

export interface FinancialEvent {
    id: string;
    UserId: string;
    EventType: FinancialEventType;
    Amount: number;
    Description: string;
    Date: string;
    type: "event";
}

export interface ProfileUpdate {
    id: string;
    Date: string;
    Description: string;
    type: "profile_change";
}

export interface AIInsightHistoryItem extends AIAnalysis {
    id: string;
    type: "ai_insight";
}

export type HistoryItem = FinancialEvent | ProfileUpdate | AIInsightHistoryItem;
