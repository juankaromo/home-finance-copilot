"use client";

import { useState, useEffect } from "react";
import { FinancialProfile, AIAnalysis } from "@/types/financial";
import InitialFinancialForm from "@/components/InitialFinancialForm";
import FinancialOverview from "@/components/FinancialOverview";
import AIAnalysisBlock from "@/components/AIAnalysisBlock";
import QuickActions from "@/components/QuickActions";

import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfile = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/financial-profile");
      const data = await res.json();

      if (data.profile) {
        setProfile(data.profile);
        setAnalysis(data.insight);
      }
    } catch (error) {
      console.error("Error fetching profile status:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium tracking-tight">Cargando tus finanzas...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <InitialFinancialForm onSuccess={() => {
          setIsLoading(true);
          fetchProfile();
        }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
            <span className="font-bold text-gray-900">HomeFinance</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500 font-medium">Mi Perfil</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-2 text-lg">Visión general de tu salud financiera.</p>
          </div>
          {isRefreshing && (
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium animate-pulse">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Actualizando...
            </div>
          )}
        </header>

        <section className="space-y-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resumen General</h2>
          <FinancialOverview profile={profile} />
        </section>

        {analysis ? (
          <section>
            <AIAnalysisBlock analysis={analysis} />
          </section>
        ) : (
          <section className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto animate-bounce duration-1000">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Calculando tu análisis...</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Tu Copilot está procesando tus datos mediante Make.com. Esto puede tardar unos segundos.</p>
            </div>
            <button
              onClick={() => fetchProfile(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition active:scale-95 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              {isRefreshing ? "Buscando..." : "Comprobar ahora"}
            </button>
          </section>
        )}

        <section>
          <QuickActions />
        </section>
      </div>
    </main>
  );
}
