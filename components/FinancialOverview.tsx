"use client";

import { FinancialProfile } from "@/types/financial";

interface FinancialOverviewProps {
    profile: FinancialProfile;
}

export default function FinancialOverview({ profile }: FinancialOverviewProps) {
    const metrics = [
        { label: "Ingresos", value: `${profile.MonthlyIncome}€`, color: "text-green-600", bg: "bg-green-50" },
        { label: "Gastos", value: `${profile.MonthlyExpenses}€`, color: "text-red-600", bg: "bg-red-50" },
        { label: "Ahorros", value: `${profile.CurrentSavings}€`, color: "text-blue-600", bg: "bg-blue-50" },
    ];

    const hasMortgage = profile.MortgageAmount > 0;
    const hasLoan = profile.LoanAmount > 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric) => (
                    <div key={metric.label} className={`p-6 rounded-2xl border border-gray-100 shadow-sm ${metric.bg}`}>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{metric.label}</p>
                        <p className={`text-3xl font-bold mt-1 ${metric.color}`}>{metric.value}</p>
                    </div>
                ))}
            </div>

            {(hasMortgage || hasLoan) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    {hasMortgage && (
                        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                Hipoteca
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Pendiente:</span>
                                    <span className="font-bold text-gray-900">{profile.MortgageAmount}€</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Interés:</span>
                                    <span className="font-medium text-gray-900">{profile.MortgageInterest}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tiempo restante:</span>
                                    <span className="font-medium text-gray-900">{profile.MortgageYearsRemaining} años</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {hasLoan && (
                        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Préstamo Personal
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Pendiente:</span>
                                    <span className="font-bold text-gray-900">{profile.LoanAmount}€</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Interés:</span>
                                    <span className="font-medium text-gray-900">{profile.LoanInterest}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tiempo restante:</span>
                                    <span className="font-medium text-gray-900">{profile.LoanYearsRemaining} años</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
