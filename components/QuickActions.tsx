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
}

export default function QuickActions({ onAction }: QuickActionsProps) {
    const actions: Action[] = [
        {
            title: "Aumentar Fondo de Emergencia",
            description: "Asegura al menos 6 meses de gastos básicos.",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "bg-blue-600",
            prefill: {
                eventType: "Otro",
                description: "Ahorro para Fondo de Emergencia"
            }
        },
        {
            title: "Reducir Gastos",
            description: "Identifica fugas de dinero en tus suscripciones.",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "bg-red-500",
            prefill: {
                eventType: "Otro",
                description: "Reducción de gasto identificada"
            }
        },
        {
            title: "Amortización",
            description: "Reduce tu deuda de hipoteca o préstamo.",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
            color: "bg-green-600",
            prefill: {
                eventType: "Amortización"
            }
        },
        {
            title: "Registrar otro hito",
            description: "Añade cualquier otro cambio financiero manualmente.",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
            color: "bg-gray-700",
            prefill: {
                eventType: "Otro"
            }
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actions.map((action) => (
                <div
                    key={action.title}
                    className="group p-6 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                    <div className="flex gap-5">
                        <div className={`w-14 h-14 shrink-0 ${action.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-gray-200`}>
                            {action.icon}
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 mb-1">{action.title}</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{action.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => action.prefill && onAction(action.prefill)}
                        className="mt-6 w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition flex items-center justify-center gap-2 group/btn"
                    >
                        Registrar
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
