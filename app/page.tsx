import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token");

  // Si ya hay un token, redirigimos al dashboard
  if (token) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl text-gray-900">HomeFinance</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
            >
              Empezar Gratis
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Toma el control de tus <span className="text-blue-600">finanzas</span> <br className="hidden md:block" /> con inteligencia artificial.
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Organiza tus gastos, planifica tus ahorros y recibe recomendaciones personalizadas para mejorar tu salud financiera en tiempo real.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-blue-200"
            >
              Comienza tu viaje financiero
            </Link>
            <Link
              href="/login"
              className="bg-white border border-gray-200 hover:border-gray-900 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition"
            >
              Ver demostración
            </Link>
          </div>
          <div className="mt-16 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-gray-50 rounded-2xl border border-gray-100 p-2 shadow-2xl">
              <div className="bg-white rounded-xl aspect-[16/9] flex items-center justify-center">
                <p className="text-gray-400 font-medium">Dashboard Preview Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Análisis Rápido</h3>
              <p className="text-gray-600">Sincroniza tus datos y deja que nuestra IA haga el trabajo pesado de analizar tus patrones de gasto.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Ahorro Inteligente</h3>
              <p className="text-gray-600">Recomendaciones personalizadas para ahorrar dinero sin sacrificar tu estilo de vida.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">IA Copilot</h3>
              <p className="text-gray-600">Un asistente financiero disponible 24/7 para responder a todas tus dudas sobre inversión y ahorro.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-12 text-center text-gray-500 text-sm">
        <p>© 2026 Home Finance Copilot. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
