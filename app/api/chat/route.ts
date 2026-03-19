import { getAuthUser } from "@/lib/auth";
import { airtableBase } from "@/lib/airtable";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompts";

export async function POST(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
        }

        const { question } = await request.json();
        if (!question) {
            return new Response(JSON.stringify({ error: "Pregunta vacía" }), { status: 400 });
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

        // 4. Llamar a OpenRouter API directamente con streaming
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error("OPENROUTER_API_KEY no configurada");
        }

        const userMessage = buildUserMessage(profile, events, latestInsight, question);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT,
                    },
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
                stream: true,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenRouter API error: ${error}`);
        }

        // Pasar el stream directamente
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        console.error("Error en Copilot Chat API:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
