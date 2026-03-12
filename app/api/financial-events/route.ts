import { NextResponse } from "next/server";
import { airtableBase } from "@/lib/airtable";
import { getAuthUser } from "@/lib/auth";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getAuthUser();
        if (!user || !user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const identifiers = [user.id, user.customId].filter(val => val && val !== 'undefined');
        const formula = `OR(${identifiers.map(id => `{UserId} = '${id}'`).join(',')}, ${identifiers.map(id => `FIND('${id}', {UserId})`).join(',')})`;

        const records = await airtableBase("FinancialEvents")
            .select({
                filterByFormula: formula,
                sort: [{ field: "Date", direction: "desc" }],
            })
            .firstPage();

        const events = records.map(r => ({
            id: r.id,
            UserId: r.fields.UserId,
            EventType: r.fields.EventType,
            Amount: r.fields.Amount,
            Description: r.fields.Description,
            Date: r.fields.Date,
            type: "event"
        }));

        return NextResponse.json({ events }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching financial events:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getAuthUser();
        if (!user || !user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { eventType, amount, description } = await request.json();

        if (!eventType || amount === undefined) {
            return NextResponse.json({ error: "Tipo de evento y cantidad son obligatorios" }, { status: 400 });
        }

        // Generar un ID único para el evento
        const eventId = createHash("md5")
            .update(user.customId + "_event_" + Date.now())
            .digest("hex")
            .substring(0, 12);

        const newRecord = await airtableBase("FinancialEvents").create([
            {
                fields: {
                    Id: eventId,
                    UserId: [user.id],
                    EventType: eventType,
                    Amount: Number(amount),
                    Description: description || "",
                    Date: new Date().toISOString()
                }
            }
        ]);

        // Crear un AIJob para recalcular insights tras el evento
        const jobId = createHash("md5").update(user.customId + "_event_job_" + Date.now()).digest("hex").substring(0, 12);
        await airtableBase("AIJobs").create([
            {
                fields: {
                    Id: jobId,
                    UserId: [user.id],
                    JobType: "financial_event",
                    Status: "pending",
                    Payload: JSON.stringify({ eventType, amount, description }),
                    CreatedAt: new Date().toISOString()
                }
            }
        ]);

        return NextResponse.json({
            message: "Evento registrado con éxito y análisis en cola",
            event: newRecord[0].fields
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error creating financial event:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
