"use client";

import { HistoryItem } from "@/types/financial";

interface UnifiedHistoryProps {
    items: HistoryItem[];
}

export default function UnifiedHistory({ items }: UnifiedHistoryProps) {
    if (items.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                <p className="text-gray-400 font-medium italic">Historial vacío. Registra tu primer evento para comenzar.</p>
            </div>
        );
    }

    // Ordenar por fecha descendente
    const sortedItems = [...items].sort((a, b) =>
        new Date(b.Date).getTime() - new Date(a.Date).getTime()
    );

    const eventTypeLabels: Record<string, string> = {
        amortization: "Amortización",
        extra_income: "Ingreso Extra",
        unexpected_expense: "Gasto Inesperado",
        goal_reached: "Meta Alcanzada",
        other: "Otro"
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="space-y-8">
                {sortedItems.map((item, index) => {
                    const isLast = index === sortedItems.length - 1;
                    const date = new Date(item.Date);

                    return (
                        <div key={item.id} className="relative pl-10 pb-8 last:pb-0">
                            {/* Línea conectora */}
                            {!isLast && (
                                <div className="absolute left-[13px] top-8 bottom-0 w-0.5 bg-gray-50"></div>
                            )}

                            {/* Punto/Icono */}
                            <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${item.id === "initial_profile" ? "bg-orange-500" :
                                item.type === "ai_insight" ? "bg-purple-500" :
                                    item.type === "event" && item.EventType === "extra_income" ? "bg-green-500" :
                                        item.type === "event" && item.EventType === "amortization" ? "bg-blue-500" :
                                            item.type === "event" && item.EventType === "unexpected_expense" ? "bg-red-500" :
                                                item.type === "event" && item.EventType === "goal_reached" ? "bg-yellow-500" :
                                                    item.type === "profile_change" ? "bg-orange-400" : "bg-gray-400"
                                }`}>
                                {(item.type === "ai_insight" || item.id === "initial_profile") && (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                                        {item.id === "initial_profile" ? "Configuración Inicial" :
                                            item.type === "ai_insight" ? "Análisis IA" :
                                                item.type === "profile_change" ? "Perfil" : "Evento"}
                                    </span>
                                    <span className="text-xs font-bold text-gray-300">
                                        {date.toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 leading-tight">
                                            {item.type === "ai_insight" ? `Salud Financiera: ${item.healthScore}/100` :
                                                item.type === "event" ? (eventTypeLabels[item.EventType] || item.EventType) :
                                                    item.Description}
                                        </h4>
                                        {item.type === "event" && item.Description && (
                                            <p className="text-gray-500 text-sm">{item.Description}</p>
                                        )}
                                        {item.type === "ai_insight" && (
                                            <div className="flex gap-2 mt-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.riskLevel === "Bajo" ? "bg-green-50 text-green-600" :
                                                    item.riskLevel === "Medio" ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                                                    }`}>
                                                    Riesgo {item.riskLevel}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {item.type === "event" && (
                                        <div className="text-right">
                                            <span className={`text-lg font-black ${item.EventType === "extra_income" || item.EventType === "goal_reached" ? "text-green-600" :
                                                item.EventType === "amortization" || item.EventType === "unexpected_expense" ? "text-red-600" : "text-gray-900"
                                                }`}>
                                                {item.EventType === "extra_income" || item.EventType === "goal_reached" ? "+" : "-"}
                                                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.Amount)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
