import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { airtableBase } from "@/lib/airtable";
import { createHash } from "crypto";

export async function POST(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { name, type, amount, initialDate, description } = await request.json();

        if (!name || !type || !amount || !initialDate) {
            return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
        }

        // Validar que el usuario sea premium (buscando por email como en financial-profile)
        let userPremiumStatus = false;
        try {
            const userRecord = await airtableBase("Users")
                .select({ filterByFormula: `{Email} = '${user.email}'` })
                .firstPage();
            
            if (userRecord.length > 0) {
                userPremiumStatus = userRecord[0].fields.IsPremium === true;
            }
        } catch (err: any) {
            console.error("Error verificando premium status:", err.message);
        }

        if (!userPremiumStatus) {
            return NextResponse.json({ error: "Esta funcionalidad solo está disponible para usuarios premium" }, { status: 403 });
        }

        // Crear registro de inversión en Airtable
        const investmentRecord = await airtableBase("Investments").create({
            UserId: user.id,
            Name: name,
            Type: type,
            Amount: amount,
            Description: description,
            InitialDate: initialDate,
            Status: "active",
        });

        return NextResponse.json({
            success: true,
            investment: investmentRecord.fields,
        });

    } catch (error: any) {
        console.error("Error creating investment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const investments = await airtableBase("Investments")
            .select({
                filterByFormula: `{UserId} = '${user.id}'`,
                sort: [{ field: "InitialDate", direction: "desc" }],
            })
            .all();

        return NextResponse.json({
            investments: investments.map(r => r.fields),
        });

    } catch (error: any) {
        console.error("Error fetching investments:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
