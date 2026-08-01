import { db } from "@/db";
import { payments } from "@/db/schema";
import { logActivity } from "@/server/clients";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updates: Partial<typeof payments.$inferInsert> = {};
  const fields = ["description", "amount", "status", "method", "dueDate", "paidAt"] as const;
  for (const field of fields) {
    if (field in body) (updates as Record<string, unknown>)[field] = body[field];
  }
  if (body.status === "paid" && !body.paidAt) {
    updates.paidAt = new Date().toISOString().slice(0, 10);
  }

  const [payment] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();

  if (body.status === "paid") {
    await logActivity("payment_received", "Pagamento recebido", payment.description, payment.id);
  } else if (body.status === "overdue") {
    await logActivity("payment_overdue", "Pagamento em atraso", payment.description, payment.id);
  }

  return Response.json({ payment });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(payments).where(eq(payments.id, id));
  return Response.json({ ok: true });
}
