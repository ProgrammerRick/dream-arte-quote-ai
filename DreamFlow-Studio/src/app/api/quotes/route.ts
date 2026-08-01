import { db } from "@/db";
import { quotes } from "@/db/schema";
import { addQuoteHistory, computeQuoteTotals, listQuotesWithClient, nextQuoteNumber } from "@/server/quotes";
import { logActivity } from "@/server/clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listQuotesWithClient();
  return Response.json({ quotes: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const number = await nextQuoteNumber();
  const { subtotal, total } = computeQuoteTotals(body.items ?? [], body.discountType ?? "percent", Number(body.discountValue ?? 0));

  const [quote] = await db
    .insert(quotes)
    .values({
      number,
      clientId: body.clientId,
      projectId: body.projectId || null,
      title: body.title,
      status: "draft",
      items: body.items ?? [],
      discountType: body.discountType ?? "percent",
      discountValue: String(body.discountValue ?? 0),
      installments: body.installments ?? 1,
      paymentMethod: body.paymentMethod || null,
      validUntil: body.validUntil || null,
      notes: body.notes || null,
      subtotal: String(subtotal),
      total: String(total),
    })
    .returning();

  await addQuoteHistory(quote.id, "draft", "Orçamento criado.");
  await logActivity("quote_created", "Orçamento criado", `${quote.number} — ${quote.title}`, quote.id);

  return Response.json({ quote }, { status: 201 });
}
