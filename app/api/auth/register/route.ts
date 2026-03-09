"use strict";

import { NextResponse } from "next/server";
import { airtableBase } from "@/lib/airtable";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        // 1. Verificar si el usuario ya existe
        const existingUsers = await airtableBase("Users")
            .select({
                filterByFormula: `{Email} = '${email}'`,
            })
            .firstPage();

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { error: "El usuario ya existe" },
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
                },
            },
        ]);

        return NextResponse.json(
            { message: "Usuario registrado con éxito", userId: record[0].id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Error al registrar el usuario" },
            { status: 500 }
        );
    }
}
