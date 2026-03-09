"use client";

import { FinancialEvent } from "@/types/financial";

interface EventsTimelineProps {
    events: FinancialEvent[];
}

export default function EventsTimeline({ events }: EventsTimelineProps) {
    if (events.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                <p className="text-gray-400 font-medium italic">Aún no has registrado ningún evento financiero.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="space-y-8">
                {events.map((event, index) => (
                    <div key={event.id} className="relative pl-8 pb-8 last:pb-0">
                        {/* Línea conectora */}
                        {index !== events.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-100"></div>
                        )}

                        {/* Punto */}
                        <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${event.EventType === "Ingreso Extra" ? "bg-green-500" :
                                event.EventType === "Amortización" ? "bg-blue-500" :
                                    event.EventType === "Gasto Inesperado" ? "bg-red-500" :
                                        event.EventType === "Meta Alcanzada" ? "bg-yellow-500" : "bg-gray-400"
                            }`}>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-gray-900">{event.EventType}</h4>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                        {new Date(event.Date).toLocaleDateString()}
                                    </span>
                                </div>
                                {event.Description && (
                                    <p className="text-gray-500 text-sm leading-relaxed">{event.Description}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <span className={`text-xl font-black ${event.EventType === "Ingreso Extra" || event.EventType === "Meta Alcanzada"
                                        ? "text-green-600"
                                        : event.EventType === "Gasto Inesperado" || event.EventType === "Amortización"
                                            ? "text-red-600"
                                            : "text-gray-900"
                                    }`}>
                                    {event.EventType === "Gasto Inesperado" || event.EventType === "Amortización" ? "-" : "+"}
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(event.Amount)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
