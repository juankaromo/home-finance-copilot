import { NextResponse } from "next/server";
import { airtableBase } from "@/lib/airtable";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change_this"
);

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        // 1. Buscar el usuario en Airtable
        const users = await airtableBase("Users")
            .select({
                filterByFormula: `{Email} = '${email}'`,
            })
            .firstPage();

        if (users.length === 0) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        const user = users[0];
        const hashedPassword = user.fields.Password as string;

        // 2. Verificar la contraseña
        const isPasswordValid = await compare(password, hashedPassword);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        // 3. Crear el token JWT
        const token = await new SignJWT({
            userId: user.id,
            email: user.fields.Email,
            name: user.fields.Name,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("2h")
            .sign(JWT_SECRET);

        // 4. Devolver la respuesta con el token (y opcionalmente una cookie)
        const response = NextResponse.json(
            { message: "Login exitoso", name: user.fields.Name },
            { status: 200 }
        );

        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 2, // 2 horas
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Error al iniciar sesión" },
            { status: 500 }
        );
    }
}
