import { db } from "@/db";
import { payments } from "@/db/schema";
import { logActivity } from "@/server/clients";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();

  const [payment] = await db
    .insert(payments)
    .values({
      clientId: body.clientId,
      projectId: body.projectId || null,
      description: body.description,
      amount: String(body.amount ?? 0),
      status: body.status ?? "pending",
      method: body.method || null,
      dueDate: body.dueDate,
      paidAt: body.status === "paid" ? body.paidAt || new Date().toISOString().slice(0, 10) : null,
    })
    .returning();

  if (payment.status === "paid") {
    await logActivity("payment_received", "Pagamento recebido", payment.description, payment.id);
  }

  return Response.json({ payment }, { status: 201 });
}
