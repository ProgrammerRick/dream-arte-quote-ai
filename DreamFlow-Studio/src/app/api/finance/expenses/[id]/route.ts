import { db } from "@/db";
import { expenses } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updates: Partial<typeof expenses.$inferInsert> = {};
  const fields = ["description", "category", "amount", "status", "method", "dueDate", "paidAt"] as const;
  for (const field of fields) {
    if (field in body) (updates as Record<string, unknown>)[field] = body[field];
  }
  if (body.status === "paid" && !body.paidAt) {
    updates.paidAt = new Date().toISOString().slice(0, 10);
  }

  const [expense] = await db.update(expenses).set(updates).where(eq(expenses.id, id)).returning();
  return Response.json({ expense });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(expenses).where(eq(expenses.id, id));
  return Response.json({ ok: true });
}
