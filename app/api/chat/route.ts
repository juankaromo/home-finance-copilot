import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { airtableBase } from "@/lib/airtable";

export async function POST(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { question } = await request.json();
        if (!question) {
            return NextResponse.json({ error: "Pregunta vacía" }, { status: 400 });
        }

        // Usamos una fórmula de búsqueda idéntica a la que ya funciona en el Dashboard
        const identifiers = [user.id, user.customId].filter(id => id && id !== 'undefined');
        const searchFormula = `OR(${identifiers.map(id => `{UserId} = '${id}'`).join(',')}, ${identifiers.map(id => `FIND('${id}', {UserId})`).join(',')})`;


        // 1. Obtener Perfil Financiero
        const profileRes = await airtableBase("FinancialProfiles")
            .select({ filterByFormula: searchFormula })
            .firstPage();
        const profile = profileRes.length > 0 ? profileRes[0].fields : {};

        // 2. Obtener últimos 20 Eventos
        const eventsRes = await airtableBase("FinancialEvents")
            .select({
                filterByFormula: searchFormula,
                maxRecords: 20,
                sort: [{ field: "Date", direction: "desc" }]
            })
            .firstPage();
        const events = eventsRes.map(e => e.fields);

        // 3. Obtener último Insight
        const insightsRes = await airtableBase("AIInsights")
            .select({
                filterByFormula: searchFormula,
                maxRecords: 1,
                sort: [{ field: "Date", direction: "desc" }]
            })
            .firstPage();
        const latestInsight = insightsRes.length > 0 ? insightsRes[0].fields : {};

        // 4. Llamar a Make.com
        const webhookUrl = process.env.MAKE_CHAT_WEBHOOK_URL;
        if (!webhookUrl) {
            throw new Error("Webhook de Chat no configurado");
        }

        const makeRes = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question,
                profile,
                events,
                latestInsight,
                userName: user.name || "Usuario",
                date: new Date().toISOString()
            })
        });

        if (!makeRes.ok) {
            const errorText = await makeRes.text();
            throw new Error(`Error en el asistente: ${errorText}`);
        }

        const responseData = await makeRes.text(); // Make.com suele devolver texto plano de GPT

        return NextResponse.json({ answer: responseData });

    } catch (error: any) {
        console.error("Error en Copilot Chat API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
