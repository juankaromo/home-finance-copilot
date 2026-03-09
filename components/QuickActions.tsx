"use client";

interface Action {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

export default function QuickActions() {
    const actions: Action[] = [
        {
            title: "Aumentar Fondo de Emergencia",
            description: "Asegura al menos 6 meses de gastos básicos.",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "bg-blue-600",
        },
        {
            title: "Reducir Gastos",
            description: "Identifica fugas de dinero en tus suscripciones.",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "bg-red-500",
        },
        {
            title: "Amortizar Hipoteca/Préstamo",
            description: "Evalúa si te conviene reducir deuda ahora.",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
            color: "bg-green-600",
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Acciones Recomendadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {actions.map((action) => (
                    <button
                        key={action.title}
                        className="group p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left"
                    >
                        <div className={`w-12 h-12 ${action.color} text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            {action.icon}
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{action.title}</h4>
                        <p className="text-sm text-gray-500">{action.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
