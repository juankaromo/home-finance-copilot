"use client";

import { useState } from "react";

export default function AICopilotChat() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al conectar con el Copilot");

            setAnswer(data.answer);
            setQuestion("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative group">
                {/* Fondo con brillo dinámico */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="flex items-center p-2">
                        <div className="flex-1 flex items-center gap-4 px-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </div>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Pregúntale a tu Copilot... (ej: ¿puedo ahorrar más este mes?)"
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 font-medium placeholder-gray-400 py-4"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !question.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-100"
                        >
                            {isLoading ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                            ) : (
                                "Preguntar"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Resultado del Copilot */}
            {(answer || error || isLoading) && (
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
                    {/* Elementos decorativos de fondo */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl"></div>

                    <div className="relative space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg">Respuesta de IA</span>
                            {isLoading && (
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                </div>
                            )}
                        </div>

                        {error ? (
                            <div className="text-red-600 font-medium flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        ) : answer ? (
                            <div className="text-gray-800 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                                {answer}
                            </div>
                        ) : isLoading ? (
                            <div className="text-gray-400 font-medium animate-pulse">
                                Tu Copilot está analizando tus datos para darte la mejor respuesta...
                            </div>
                        ) : null}

                        {answer && (
                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={() => setAnswer(null)}
                                    className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Limpiar chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
