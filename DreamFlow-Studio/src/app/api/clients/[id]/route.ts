import { db } from "@/db";
import { clients } from "@/db/schema";
import { addClientHistoryEntry, getClientById } from "@/server/clients";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getClientById(id);
  if (!data) return Response.json({ error: "Cliente não encontrado." }, { status: 404 });
  return Response.json(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (body.historyEntry) {
    await addClientHistoryEntry(id, body.historyEntry.type ?? "note", body.historyEntry.description);
    const data = await getClientById(id);
    return Response.json(data);
  }

  const updates: Partial<typeof clients.$inferInsert> = {};
  const fields = [
    "name", "company", "email", "phone", "whatsapp", "status", "avatarColor", "photoUrl",
    "documentType", "documentNumber", "zipCode", "street", "addressNumber", "complement",
    "district", "city", "state", "tags", "notes",
  ] as const;
  for (const field of fields) {
    if (field in body) (updates as Record<string, unknown>)[field] = body[field];
  }
  updates.updatedAt = new Date();

  const [client] = await db.update(clients).set(updates).where(eq(clients.id, id)).returning();
  return Response.json({ client });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(clients).where(eq(clients.id, id));
  return Response.json({ ok: true });
}
