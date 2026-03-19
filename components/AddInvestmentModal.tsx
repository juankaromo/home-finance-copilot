"use client";

import { useState } from "react";

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type InvestmentType = "stock" | "index_fund" | "bond" | "etf" | "crypto" | "real_estate" | "pension" | "other";

const INVESTMENT_TYPES: { value: InvestmentType; label: string }[] = [
    { value: "stock", label: "Acciones" },
    { value: "etf", label: "ETF / Fondos de Inversión" },
    { value: "bond", label: "Bonos" },
    { value: "index_fund", label: "Fondo Indexado" },
    { value: "crypto", label: "Criptomonedas" },
    { value: "real_estate", label: "Bienes Raíces" },
    { value: "pension", label: "Plan de Pensión" },
    { value: "other", label: "Otro" },
];

export default function AddInvestmentModal({ isOpen, onClose, onSuccess }: AddInvestmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "etf" as InvestmentType,
        amount: "",
        initialDate: new Date().toISOString().split('T')[0],
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.amount.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/investments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    type: formData.type,
                    amount: parseFloat(formData.amount),
                    initialDate: formData.initialDate,
                    description: formData.description,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al agregar inversión");

            // Reset form
            setFormData({
                name: "",
                type: "etf",
                amount: "",
                initialDate: new Date().toISOString().split('T')[0],
                description: "",
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black">Agregar Inversión</h2>
                        <p className="text-blue-100 text-sm mt-1">Registra un nuevo producto de inversión</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">
                            Nombre del Producto
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="ej: Apple Inc., Vanguard S&P 500..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Tipo de Inversión */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">
                            Tipo de Inversión
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as InvestmentType })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {INVESTMENT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Monto Invertido */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">
                            Monto Invertido
                        </label>
                        <div className="flex items-center">
                            <span className="text-gray-600 font-bold">$</span>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="flex-1 px-3 py-3 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Fecha de Inicio */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            value={formData.initialDate}
                            onChange={(e) => setFormData({ ...formData, initialDate: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">
                            Notas (Opcional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="ej: Fondo a largo plazo para jubilación..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.name.trim() || !formData.amount.trim() || !formData.initialDate}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Guardando..." : "Agregar Inversión"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
