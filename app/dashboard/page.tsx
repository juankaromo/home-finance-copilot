import { DashboardCard } from "../../components/DashboardCard";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Dashboard financiero</h1>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <DashboardCard title="Balance mensual" description="Ingreso vs gasto del mes actual." />
        <DashboardCard title="Recomendación IA" description="Sugerencias para optimizar tus finanzas." />
      </section>
    </main>
  );
}
