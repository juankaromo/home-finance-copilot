export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type FinancialProfile = {
  userId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
};

export type FinancialEvent = {
  userId: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
};
