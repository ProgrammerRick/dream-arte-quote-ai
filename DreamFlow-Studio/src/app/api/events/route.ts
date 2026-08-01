import { db } from "@/db";
import { events } from "@/db/schema";
import { logActivity } from "@/server/clients";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();

  const [event] = await db
    .insert(events)
    .values({
      title: body.title,
      description: body.description || null,
      type: body.type ?? "meeting",
      date: body.date,
      time: body.time || null,
      clientId: body.clientId || null,
      projectId: body.projectId || null,
    })
    .returning();

  await logActivity("event_created", "Novo compromisso na agenda", event.title, event.id);

  return Response.json({ event }, { status: 201 });
}
