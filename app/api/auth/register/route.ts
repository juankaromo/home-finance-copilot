import { NextResponse } from "next/server";
import { airtableBase } from "@/lib/airtable";
import { hash } from "bcryptjs";
import { createHash } from "crypto";

export async function POST(request: Request) {
    try {
        const { name, email, password, birthDate } = await request.json();

        if (!email || !password || !name || !birthDate) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        // Generar un ID único basado en el email
        const generatedId = createHash("md5").update(email.toLowerCase() + Date.now()).digest("hex").substring(0, 12);

        // 1. Verificar si el email ya existe
        const existingUsers = await airtableBase("Users")
            .select({
                filterByFormula: `{Email} = '${email}'`,
            })
            .firstPage();

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { error: "El correo ya está registrado" },
                { status: 409 }
            );
        }

        // 2. Hashear la contraseña
        const hashedPassword = await hash(password, 10);

        // 3. Crear el usuario en Airtable
        const record = await airtableBase("Users").create([
            {
                fields: {
                    Name: name,
                    Email: email,
                    Password: hashedPassword,
                    Id: generatedId,
                    BirthDate: birthDate
                },
            },
        ]);

        return NextResponse.json(
            { message: "Usuario registrado con éxito", userId: generatedId },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Error al registrar el usuario", details: error.message },
            { status: 500 }
        );
    }
}
