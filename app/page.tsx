import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";

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
            <Logo size={32} />
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
            Entiende tus finanzas de <span className="text-blue-600">verdad</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Sin jerga, sin complicaciones. Solo tu situación financiera explicada de forma clara y recomendaciones que puedes entender y actuar.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-blue-200"
            >
              Comienza gratis
            </Link>
            <Link
              href="/login"
              className="bg-white border border-gray-200 hover:border-gray-900 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona - Paso a paso */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Tres pasos para empezar</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Línea conectora */}
            <div className="hidden md:block absolute top-32 left-0 right-0 h-1 bg-blue-200"></div>
            
            {/* Paso 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative z-10">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Cuéntanos sobre ti</h3>
                <p className="text-gray-600 text-center text-sm">
                  Ingresa cuánto ganas, cuánto gastas, cuánto ahorras y cuál es tu meta. Nada complicado.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative z-10">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Nosotros analizamos</h3>
                <p className="text-gray-600 text-center text-sm">
                  Te mostramos cómo está tu situación financiera y dónde hay oportunidades para mejorar.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative z-10">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Toma decisiones</h3>
                <p className="text-gray-600 text-center text-sm">
                  Obtén consejos claros, pregunta lo que quieras a nuestro asistente y actúa cuando quieras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios cuantitativos */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Qué puedes lograr</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-blue-600 mb-3">5 min</div>
              <p className="text-gray-600">Configura tu perfil en menos de 5 minutos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-blue-600 mb-3">💡</div>
              <p className="text-gray-600">Obtén consejos que realmente puedes aplicar</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-blue-600 mb-3">📊</div>
              <p className="text-gray-600">Ve tus números de forma clara y visual</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-blue-600 mb-3">🔒</div>
              <p className="text-gray-600">Tus datos están completamente protegidos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features detalladas */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Lo que conseguirás</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Claridad sobre tu situación</h3>
                <p className="text-gray-600">Sabrás exactamente en qué punto estás financieramente y recibirás un análisis honesto de tu situación.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Consejos que funcionan</h3>
                <p className="text-gray-600">Recomendaciones prácticas y realistas basadas en tu situación específica, no consejos genéricos.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Tu asistente siempre disponible</h3>
                <p className="text-gray-600">Pregunta lo que quieras sobre tus finanzas, sin necesidad de pagar a un asesor. Disponible cuando lo necesites.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Tu historial en un lugar</h3>
                <p className="text-gray-600">Ve cómo tu situación financiera ha cambiado a lo largo del tiempo y aprende de tus decisiones pasadas.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Control total de deudas</h3>
                <p className="text-gray-600">Mantén un seguimiento de hipotecas y préstamos, sabe exactamente qué debes y cuándo termina cada deuda.</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">100% privado y seguro</h3>
                <p className="text-gray-600">Solo tú tienes acceso a tus datos. Ningún tercero podrá verlos o usarlos. Tu información es solo tuya.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">¿No sabes por dónde empezar?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Muchas personas como tú están tomando control de sus finanzas. No es complicado, te lo mostramos paso a paso.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-blue-200"
          >
            Crea tu cuenta ahora
          </Link>
          <p className="mt-6 text-gray-500 text-sm">Gratis. Sin sorpresas. Empieza hoy.</p>
        </div>
      </section>

      <footer className="border-t py-12 text-center text-gray-500 text-sm">
        <p>© 2026 Home Finance Copilot. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
