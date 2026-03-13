"use client";

import { useState } from "react";

interface InitialFinancialFormProps {
    onSuccess: () => void;
}

export default function InitialFinancialForm({ onSuccess }: InitialFinancialFormProps) {
    const [formData, setFormData] = useState({
        monthlyIncome: "",
        monthlyExpenses: "",
        currentSavings: "",
        mortgageInitialAmount: "",
        mortgageCurrentAmount: "",
        mortgageInterest: "",
        mortgageEndDate: "",
        loanInitialAmount: "",
        loanCurrentAmount: "",
        loanInterest: "",
        loanEndDate: "",
        children: "",
        financialGoal: "",
    });

    const [hasMortgage, setHasMortgage] = useState(false);
    const [hasLoan, setHasLoan] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Limpiar campos si se desactivaron los toggles
        const submissionData = {
            ...formData,
            mortgageInitialAmount: hasMortgage ? formData.mortgageInitialAmount : "0",
            mortgageCurrentAmount: hasMortgage ? formData.mortgageCurrentAmount : "0",
            mortgageInterest: hasMortgage ? formData.mortgageInterest : "0",
            mortgageEndDate: hasMortgage ? formData.mortgageEndDate : "",
            loanInitialAmount: hasLoan ? formData.loanInitialAmount : "0",
            loanCurrentAmount: hasLoan ? formData.loanCurrentAmount : "0",
            loanInterest: hasLoan ? formData.loanInterest : "0",
            loanEndDate: hasLoan ? formData.loanEndDate : "",
        };

        try {
            const res = await fetch("/api/financial-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al guardar el perfil");
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 max-w-2xl mx-auto text-center space-y-4 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">¡Perfil Guardado!</h2>
                <p className="text-gray-500">Preparando tu dashboard personalizado...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-2xl mx-auto">
            <div className="mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Configura tu Perfil Financiero</h2>
                <p className="text-gray-500 mt-2">Personaliza tu asistente para obtener recomendaciones precisas.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200 animate-pulse">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
                        Información Básica
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ingresos Mensuales (€)</label>
                            <input
                                type="number"
                                name="monthlyIncome"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50/50"
                                placeholder="3000"
                                value={formData.monthlyIncome}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gastos Mensuales (€)</label>
                            <input
                                type="number"
                                name="monthlyExpenses"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50/50"
                                placeholder="1500"
                                value={formData.monthlyExpenses}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ahorros Actuales (€)</label>
                            <input
                                type="number"
                                name="currentSavings"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50/50"
                                placeholder="10000"
                                value={formData.currentSavings}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Hijos</label>
                            <input
                                type="number"
                                name="children"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50/50"
                                placeholder="0"
                                value={formData.children}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Sección de Hipoteca */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all">
                        <div>
                            <h3 className="font-semibold text-gray-900">¿Tienes hipoteca?</h3>
                            <p className="text-xs text-gray-500">Activa para detallar tu préstamo hipotecario</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setHasMortgage(!hasMortgage)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${hasMortgage ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasMortgage ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {hasMortgage && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-blue-50/30 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Importe Inicial (€)</label>
                                <input
                                    type="number"
                                    name="mortgageInitialAmount"
                                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                    placeholder="150000"
                                    value={formData.mortgageInitialAmount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Importe Actual (€)</label>
                                <input
                                    type="number"
                                    name="mortgageCurrentAmount"
                                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                    placeholder="120000"
                                    value={formData.mortgageCurrentAmount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Interés (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="mortgageInterest"
                                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                    placeholder="3.5"
                                    value={formData.mortgageInterest}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Fecha de Fin</label>
                                <input
                                    type="date"
                                    name="mortgageEndDate"
                                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                    value={formData.mortgageEndDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sección de Préstamos Personales */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all">
                        <div>
                            <h3 className="font-semibold text-gray-900">¿Tienes otros préstamos?</h3>
                            <p className="text-xs text-gray-500">Préstamos personales, coche, estudios...</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setHasLoan(!hasLoan)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${hasLoan ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasLoan ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {hasLoan && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-purple-50/30 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-xs font-semibold text-purple-700 mb-1 uppercase tracking-wider">Importe Inicial (€)</label>
                                <input
                                    type="number"
                                    name="loanInitialAmount"
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition bg-white"
                                    placeholder="5000"
                                    value={formData.loanInitialAmount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-purple-700 mb-1 uppercase tracking-wider">Importe Actual (€)</label>
                                <input
                                    type="number"
                                    name="loanCurrentAmount"
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition bg-white"
                                    placeholder="3000"
                                    value={formData.loanCurrentAmount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-purple-700 mb-1 uppercase tracking-wider">Interés (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="loanInterest"
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition bg-white"
                                    placeholder="7.5"
                                    value={formData.loanInterest}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-purple-700 mb-1 uppercase tracking-wider">Fecha de Fin</label>
                                <input
                                    type="date"
                                    name="loanEndDate"
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition bg-white"
                                    value={formData.loanEndDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tu Objetivo Financiero</label>
                    <textarea
                        name="financialGoal"
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50/50"
                        placeholder="Ej: Ahorrar para la jubilación, comprar una segunda vivienda, reducir deudas..."
                        value={formData.financialGoal}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Guardando perfil...
                        </span>
                    ) : "Finalizar Configuración"}
                </button>
            </form>
        </div>
    );
}
