import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updates: Partial<typeof events.$inferInsert> = {};
  const fields = ["title", "description", "type", "date", "time", "completed"] as const;
  for (const field of fields) {
    if (field in body) (updates as Record<string, unknown>)[field] = body[field];
  }

  const [event] = await db.update(events).set(updates).where(eq(events.id, id)).returning();
  return Response.json({ event });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(events).where(eq(events.id, id));
  return Response.json({ ok: true });
}
