import { db } from "@/db";
import { clients, projects, quoteHistory, quotes, type QuoteItem } from "@/db/schema";
import { desc, eq, gte, sql } from "drizzle-orm";

export async function nextQuoteNumber() {
  const year = new Date().getFullYear();
  const startOfYear = `${year}-01-01`;
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(quotes)
    .where(gte(quotes.createdAt, new Date(startOfYear)));
  const sequence = (count ?? 0) + 1;
  return `ORC-${year}-${String(sequence).padStart(4, "0")}`;
}

export function computeQuoteTotals(
  items: QuoteItem[],
  discountType: string,
  discountValue: number,
) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount = discountType === "percent" ? (subtotal * discountValue) / 100 : discountValue;
  const total = Math.max(0, subtotal - discount);
  return { subtotal, total };
}

export async function listQuotesWithClient() {
  const rows = await db
    .select({ quote: quotes, client: clients })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .orderBy(desc(quotes.createdAt));
  return rows.map((row) => ({ ...row.quote, client: row.client }));
}

export async function getQuoteById(id: string) {
  const [row] = await db
    .select({ quote: quotes, client: clients })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .where(eq(quotes.id, id));
  if (!row) return null;

  const [project] = row.quote.projectId
    ? await db.select().from(projects).where(eq(projects.id, row.quote.projectId))
    : [null];

  const history = await db
    .select()
    .from(quoteHistory)
    .where(eq(quoteHistory.quoteId, id))
    .orderBy(desc(quoteHistory.createdAt));

  return { quote: row.quote, client: row.client, project, history };
}

export async function addQuoteHistory(quoteId: string, status: string, note?: string) {
  await db.insert(quoteHistory).values({ quoteId, status, note });
}
