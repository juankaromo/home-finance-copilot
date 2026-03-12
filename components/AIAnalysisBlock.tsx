"use client";

import { AIAnalysis } from "@/types/financial";

interface AIAnalysisBlockProps {
    analysis: AIAnalysis | null;
    isLoading?: boolean;
    onRefresh?: () => void;
}

export default function AIAnalysisBlock({ analysis, isLoading, onRefresh }: AIAnalysisBlockProps) {
    if (isLoading || !analysis) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 animate-pulse">
                    <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Actualizando tu Análisis</h2>
                <p className="text-gray-500 max-w-sm">
                    Tu Financial Copilot está procesando los últimos cambios para darte recomendaciones actualizadas.
                </p>
                <div className="flex gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></span>
                </div>
            </div>
        );
    }
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 border-green-200 bg-green-50";
        if (score >= 50) return "text-yellow-600 border-yellow-200 bg-yellow-50";
        return "text-red-600 border-red-200 bg-red-50";
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "Bajo": return "text-green-700 bg-green-100";
            case "Medio": return "text-yellow-700 bg-yellow-100";
            case "Alto": return "text-red-700 bg-red-100";
            default: return "text-gray-700 bg-gray-100";
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case "high": return "bg-red-50 text-red-700 border-red-100";
            case "medium": return "bg-yellow-50 text-yellow-700 border-yellow-100";
            case "low": return "bg-green-50 text-green-700 border-green-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case "high": return "Prioridad Alta";
            case "medium": return "Prioridad Media";
            case "low": return "Prioridad Baja";
            default: return "Prioridad";
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header con Salud y Riesgo */}
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Análisis Inteligente</h2>
                            <p className="text-sm text-gray-500 font-medium">Actualizado hace unos momentos</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className={`px-6 py-3 rounded-2xl border-2 flex flex-col items-center ${getScoreColor(analysis.healthScore)}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Salud</span>
                            <span className="text-2xl font-black leading-tight">{analysis.healthScore}/100</span>
                        </div>
                        <div className="px-6 py-3 rounded-2xl border-2 border-gray-100 bg-white flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Riesgo</span>
                            <span className={`text-[10px] font-black mt-1.5 px-3 py-1 rounded-lg uppercase tracking-wider ${getRiskColor(analysis.riskLevel)}`}>
                                {analysis.riskLevel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Resumen del Análisis */}
                {analysis.summaryPoints && analysis.summaryPoints.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumen del Copilot</h3>
                        <div className="bg-purple-50/30 p-6 rounded-3xl border border-purple-50 space-y-3">
                            {analysis.summaryPoints.map((point, i) => (
                                <div key={i} className="flex gap-3 text-gray-700 leading-relaxed font-medium italic">
                                    <span className="text-purple-400 mt-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </span>
                                    {point.trim()}{!point.trim().endsWith('.') && '.'}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recomendaciones Estructuradas */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Próximos Pasos Recomendados</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {analysis.recommendations.map((rec, index) => (
                            <div key={index} className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md border uppercase tracking-wider ${getPriorityStyle(rec.priority)}`}>
                                            {getPriorityLabel(rec.priority)}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 font-bold leading-tight text-lg">
                                        {rec.action}
                                    </p>
                                    <p className="text-gray-500 text-sm font-medium">
                                        <span className="text-purple-600 font-bold">Impacto:</span> {rec.impact}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
