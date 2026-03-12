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

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Análisis Inteligente</h2>
                        <p className="text-sm text-gray-500">Basado en tu perfil financiero actual.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className={`px-6 py-3 rounded-xl border flex flex-col items-center ${getScoreColor(analysis.healthScore)}`}>
                        <span className="text-xs font-bold uppercase tracking-wider opacity-70">Salud</span>
                        <span className="text-2xl font-black">{analysis.healthScore}/100</span>
                    </div>
                    <div className="px-6 py-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Riesgo</span>
                        <span className={`text-sm font-bold mt-1 px-3 py-0.5 rounded-full ${getRiskColor(analysis.riskLevel)}`}>
                            {analysis.riskLevel}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recomendaciones de tu Copilot</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.recommendations.map((rec, index) => (
                        <div key={index} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 text-sm leading-relaxed">
                            <span className="text-blue-600 font-bold">•</span>
                            {rec}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
