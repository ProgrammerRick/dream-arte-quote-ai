import { db } from "@/db";
import { expenses } from "@/db/schema";
import { logActivity } from "@/server/clients";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();

  const [expense] = await db
    .insert(expenses)
    .values({
      description: body.description,
      category: body.category || "Geral",
      amount: String(body.amount ?? 0),
      status: body.status ?? "pending",
      method: body.method || null,
      dueDate: body.dueDate,
      paidAt: body.status === "paid" ? body.paidAt || new Date().toISOString().slice(0, 10) : null,
    })
    .returning();

  await logActivity("expense_added", "Nova despesa registrada", expense.description, expense.id);

  return Response.json({ expense }, { status: 201 });
}
