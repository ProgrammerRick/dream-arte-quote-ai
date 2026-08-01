import { db } from "@/db";
import { projects, quotes } from "@/db/schema";
import { addQuoteHistory, computeQuoteTotals, getQuoteById, nextQuoteNumber } from "@/server/quotes";
import { logActivity } from "@/server/clients";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getQuoteById(id);
  if (!data) return Response.json({ error: "Orçamento não encontrado." }, { status: 404 });
  return Response.json(data);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data = await getQuoteById(id);
  if (!data) return Response.json({ error: "Orçamento não encontrado." }, { status: 404 });

  if (body.action === "duplicate") {
    const number = await nextQuoteNumber();
    const [copy] = await db
      .insert(quotes)
      .values({
        number,
        clientId: data.quote.clientId,
        title: `${data.quote.title} (cópia)`,
        status: "draft",
        items: data.quote.items,
        discountType: data.quote.discountType,
        discountValue: data.quote.discountValue,
        installments: data.quote.installments,
        paymentMethod: data.quote.paymentMethod,
        validUntil: data.quote.validUntil,
        notes: data.quote.notes,
        subtotal: data.quote.subtotal,
        total: data.quote.total,
      })
      .returning();
    await addQuoteHistory(copy.id, "draft", `Duplicado a partir de ${data.quote.number}.`);
    return Response.json({ quote: copy }, { status: 201 });
  }

  if (body.action === "convert") {
    const [project] = await db
      .insert(projects)
      .values({
        clientId: data.quote.clientId,
        name: data.quote.title,
        description: data.quote.notes || null,
        status: "active",
        priority: "medium",
        budget: data.quote.total,
        progress: 0,
      })
      .returning();

    await db
      .update(quotes)
      .set({ projectId: project.id, status: "approved", approvedAt: new Date(), updatedAt: new Date() })
      .where(eq(quotes.id, id));

    await addQuoteHistory(id, "approved", `Convertido em projeto: ${project.name}.`);
    await logActivity("project_created", "Orçamento convertido em projeto", project.name, project.id);

    return Response.json({ project });
  }

  return Response.json({ error: "Ação inválida." }, { status: 400 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (body.status) {
    const timestamps: Record<string, Partial<typeof quotes.$inferInsert>> = {
      sent: { sentAt: new Date() },
      approved: { approvedAt: new Date() },
    };
    await db
      .update(quotes)
      .set({ status: body.status, updatedAt: new Date(), ...(timestamps[body.status] ?? {}) })
      .where(eq(quotes.id, id));
    await addQuoteHistory(id, body.status, body.note);
    if (body.status === "sent") await logActivity("quote_sent", "Orçamento enviado", undefined, id);
    if (body.status === "approved") await logActivity("quote_approved", "Orçamento aprovado", undefined, id);
  } else {
    const updates: Partial<typeof quotes.$inferInsert> = { updatedAt: new Date() };
    const fields = ["title", "items", "discountType", "discountValue", "installments", "paymentMethod", "validUntil", "notes"] as const;
    for (const field of fields) {
      if (field in body) (updates as Record<string, unknown>)[field] = body[field];
    }
    if (body.items) {
      const { subtotal, total } = computeQuoteTotals(body.items, body.discountType ?? "percent", Number(body.discountValue ?? 0));
      updates.subtotal = String(subtotal);
      updates.total = String(total);
    }
    await db.update(quotes).set(updates).where(eq(quotes.id, id));
  }

  const data = await getQuoteById(id);
  return Response.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(quotes).where(eq(quotes.id, id));
  return Response.json({ ok: true });
}
