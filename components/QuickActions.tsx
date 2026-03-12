"use client";

import { FinancialEventType } from "@/types/financial";

interface Action {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    prefill?: {
        eventType: FinancialEventType;
        amount?: string;
        description?: string;
    };
}

interface QuickActionsProps {
    onAction: (prefill: any) => void;
    onUpdateProfile: () => void;
}

export default function QuickActions({ onAction, onUpdateProfile }: QuickActionsProps) {
    const categories = [
        {
            title: "📈 Impulso y Crecimiento",
            actions: [
                {
                    title: "Ingreso Extra / Bonus",
                    description: "Registra cobros extraordinarios o aumentos.",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    color: "bg-blue-600",
                    onClick: () => onAction({ eventType: "extra_income", description: "Ingreso extraordinario" })
                },
                {
                    title: "Gasto Inesperado",
                    description: "Registra facturas o gastos fuera de lo común.",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
                    color: "bg-red-500",
                    onClick: () => onAction({ eventType: "unexpected_expense", description: "Gasto imprevisto" })
                }
            ]
        },
        {
            title: "⚖️ Optimización de Deuda",
            actions: [
                {
                    title: "Amortización",
                    description: "Reduce tu deuda de hipoteca o préstamo.",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
                    color: "bg-green-600",
                    onClick: () => onAction({ eventType: "amortization" })
                }
            ]
        },
        {
            title: "⚙️ Ajuste de Perfil Base",
            actions: [
                {
                    title: "Actualizar Mis Cifras",
                    description: "Cambia tu sueldo, gastos fijos o ahorros totales.",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
                    color: "bg-gray-800",
                    onClick: () => onUpdateProfile()
                }
            ]
        }
    ];

    return (
        <div className="space-y-10">
            {categories.map((category) => (
                <div key={category.title} className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                        {category.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.actions.map((action) => (
                            <button
                                key={action.title}
                                onClick={action.onClick}
                                className="group p-5 rounded-3xl border border-gray-100 bg-white shadow-sm hover:border-purple-200 hover:shadow-md transition-all flex items-center gap-5 text-left"
                            >
                                <div className={`w-12 h-12 shrink-0 ${action.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-gray-200`}>
                                    {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 leading-tight mb-1 truncate">{action.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{action.description}</p>
                                </div>
                                <div className="hidden sm:flex w-8 h-8 bg-gray-50 rounded-full items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
