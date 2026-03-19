"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AICopilotChatProps {
    isDisabled?: boolean;
}

export default function AICopilotChat({ isDisabled = false }: AICopilotChatProps) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || isLoading || isDisabled) return;

        setIsLoading(true);
        setError(null);
        setAnswer("");
        setQuestion("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Error al conectar con el Copilot");
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error("No response body");

            const decoder = new TextDecoder();
            let fullText = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Procesar líneas completadas
                const lines = buffer.split('\n');
                buffer = lines[lines.length - 1]; // Guardar línea incompleta

                for (let i = 0; i < lines.length - 1; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            const content = data.choices?.[0]?.delta?.content || '';
                            if (content) {
                                fullText += content;
                                setAnswer(fullText);
                            }
                        } catch {
                            // Ignorar líneas que no sean JSON válido
                        }
                    }
                }
            }
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
                                placeholder={isDisabled ? "Espera a que se cargue el análisis..." : "Pregúntale a tu Copilot... (ej: ¿puedo ahorrar más este mes?)"}
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 font-medium placeholder-gray-400 py-4 disabled:text-gray-400"
                                disabled={isLoading || isDisabled}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !question.trim() || isDisabled}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-100"
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
                            <div className="text-gray-800 leading-relaxed font-medium text-lg prose prose-sm max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                        em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-gray-800" {...props} />,
                                        code: ({ node, inline, ...props }: any) => 
                                            inline ? (
                                                <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                                            ) : (
                                                <code className="block bg-gray-100 text-gray-900 px-4 py-3 rounded-lg mb-3 font-mono text-sm overflow-auto" {...props} />
                                            ),
                                    }}
                                >
                                    {answer}
                                </ReactMarkdown>
                            </div>
                        ) : isLoading ? (
                            <div className="text-gray-400 font-medium animate-pulse">
                                Tu Copilot está analizando tus datos para darte la mejor respuesta...
                            </div>
                        ) : null}

                        {answer && !isLoading && (
                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={() => setAnswer("")}
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
