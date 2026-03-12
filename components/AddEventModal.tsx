"use client";

import { useState, useEffect } from "react";
import { FinancialEventType } from "@/types/financial";

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialValue?: {
        eventType: FinancialEventType;
        amount?: string;
        description?: string;
    };
}

export default function AddEventModal({ isOpen, onClose, onSuccess, initialValue }: AddEventModalProps) {
    const [eventType, setEventType] = useState<FinancialEventType>("amortization");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialValue) {
            setEventType(initialValue.eventType);
            setAmount(initialValue.amount || "");
            setDescription(initialValue.description || "");
        }
    }, [initialValue]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/financial-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventType,
                    amount: Number(amount),
                    description,
                }),
            });

            if (!res.ok) throw new Error("Error al guardar el evento");

            onSuccess();
            onClose();
            // Reset form
            setAmount("");
            setDescription("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Registrar Evento</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Tipo de Evento</label>
                            <select
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value as FinancialEventType)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                            >
                                <option value="amortization">Amortización (Hipoteca/Préstamo)</option>
                                <option value="extra_income">Ingreso Extra</option>
                                <option value="unexpected_expense">Gasto Inesperado</option>
                                <option value="goal_reached">Meta Alcanzada</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Cantidad (€)</label>
                            <input
                                type="number"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ej: Bonus trimestral, Amortización parcial..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition resize-none"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : "Guardar Evento"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
