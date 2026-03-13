import "./globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HomeFinance - Tu Asistente Financiero IA",
  description: "Gestiona tus finanzas de forma inteligente con análisis de IA, recomendaciones personalizadas y seguimiento completo de tu situación financiera.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
