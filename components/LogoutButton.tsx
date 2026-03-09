"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        // Para cerrar sesión, simplemente borramos la cookie y redirigimos
        // Como la cookie es HTTP-only, lo mejor es hacerlo vía API o sobreescribiéndola si es posible,
        // pero la forma más limpia es una ruta de API de logout.
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
    };

    return (
        <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition font-medium"
        >
            Cerrar Sesión
        </button>
    );
}
