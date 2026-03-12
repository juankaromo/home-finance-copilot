"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FinancialProfile, AIAnalysis, FinancialEvent, HistoryItem } from "@/types/financial";
import InitialFinancialForm from "@/components/InitialFinancialForm";
import FinancialOverview from "@/components/FinancialOverview";
import AIAnalysisBlock from "@/components/AIAnalysisBlock";
import QuickActions from "@/components/QuickActions";
import UnifiedHistory from "@/components/UnifiedHistory";
import AddEventModal from "@/components/AddEventModal";

import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [hasActiveJob, setHasActiveJob] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPrefill, setModalPrefill] = useState<any>(null);

  const fetchData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      // 1. Fetch Perfil e AI Analysis History
      const profileRes = await fetch("/api/financial-profile");
      const profileData = await profileRes.json();

      if (profileData.error === "No autorizado") {
        router.push("/login");
        return;
      }

      if (!profileData || !profileData.profile) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setProfile(profileData.profile);
      setAnalysis(profileData.insight); // El último insight
      setHasActiveJob(profileData.hasActiveJob);

      // 2. Fetch Eventos
      const eventsRes = await fetch("/api/financial-events");
      const eventsData = await eventsRes.json();

      const allEvents = eventsData.events || [];
      const allInsights = profileData.allInsights || [];

      // 3. Agregar evento inicial de perfil
      const initialProfileItem: any = {
        id: "initial_profile",
        Date: profileData.profile.ProfileCreated || profileData.profile.ProfileLastModified || new Date().toISOString(),
        Description: "Perfil financiero creado y configurado",
        type: "profile_change"
      };

      // Combinar para el historial unificado y ordenar
      const combined = [...allEvents, ...allInsights, initialProfileItem];
      setHistory(combined);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickAction = (prefill: any) => {
    setModalPrefill(prefill);
    setIsModalOpen(true);
  };

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
          fetchData();
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
            <span className="text-gray-500 font-medium tracking-tight">Mi Perfil</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-16 space-y-16">
        {/* 1. Bloque de Overview */}
        <section className="space-y-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Visión General</h2>
          <FinancialOverview profile={profile} />
        </section>

        {/* 2. Cálculo de Análisis */}
        <section className="space-y-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Cálculo de Análisis</h2>
          {analysis || hasActiveJob ? (
            <AIAnalysisBlock
              analysis={analysis}
              isLoading={hasActiveJob}
              onRefresh={() => fetchData(true)}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Calculando tu análisis...</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">Tu Copilot está procesando tus datos. Refresca para ver los resultados.</p>
              </div>
              <button
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition active:scale-95 disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Comprobar ahora
              </button>
            </div>
          )}
        </section>

        {/* 3. Acciones Recomendadas */}
        <section className="space-y-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Acciones Recomendadas</h2>
          <QuickActions onAction={handleQuickAction} />
        </section>

        {/* 4. Historial */}
        <section className="space-y-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Historial Reciente</h2>
          <UnifiedHistory items={history} />
        </section>
      </div>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalPrefill(null);
        }}
        onSuccess={() => fetchData(true)}
        initialValue={modalPrefill}
      />
    </main>
  );
}
