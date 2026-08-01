import { db } from "@/db";
import { clients, expenses, payments, projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

function startOfMonth(offset = 0) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function endOfMonth(offset = 0) {
  const date = startOfMonth(offset + 1);
  date.setDate(date.getDate() - 1);
  date.setHours(23, 59, 59, 999);
  return date;
}
function monthsAgo(count: number) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - count);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getFinanceOverview() {
  const [paymentRows, expenseRows] = await Promise.all([
    db
      .select({ payment: payments, client: clients, project: projects })
      .from(payments)
      .leftJoin(clients, eq(payments.clientId, clients.id))
      .leftJoin(projects, eq(payments.projectId, projects.id))
      .orderBy(desc(payments.createdAt)),
    db.select().from(expenses).orderBy(desc(expenses.createdAt)),
  ]);

  const entradas = paymentRows.map((r) => ({ ...r.payment, clientName: r.client?.name ?? "Cliente", projectName: r.project?.name ?? null }));

  const totalRecebido = entradas.filter((e) => e.status === "paid").reduce((s, e) => s + Number(e.amount), 0);
  const totalPendenteEntrada = entradas.filter((e) => e.status === "pending").reduce((s, e) => s + Number(e.amount), 0);
  const totalAtrasadoEntrada = entradas.filter((e) => e.status === "overdue").reduce((s, e) => s + Number(e.amount), 0);

  const totalPagoSaida = expenseRows.filter((e) => e.status === "paid").reduce((s, e) => s + Number(e.amount), 0);
  const totalPendenteSaida = expenseRows.filter((e) => e.status === "pending").reduce((s, e) => s + Number(e.amount), 0);
  const totalAtrasadoSaida = expenseRows.filter((e) => e.status === "overdue").reduce((s, e) => s + Number(e.amount), 0);

  const lucro = totalRecebido - totalPagoSaida;

  const cashFlow = Array.from({ length: 6 }).map((_, index) => {
    const offset = 5 - index;
    const start = monthsAgo(offset);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    const receita = entradas
      .filter((e) => e.status === "paid" && e.paidAt && new Date(e.paidAt) >= start && new Date(e.paidAt) <= end)
      .reduce((s, e) => s + Number(e.amount), 0);
    const despesa = expenseRows
      .filter((e) => e.status === "paid" && e.paidAt && new Date(e.paidAt) >= start && new Date(e.paidAt) <= end)
      .reduce((s, e) => s + Number(e.amount), 0);

    return { month: start, receita, despesa, lucro: receita - despesa };
  });

  const currentMonthReceita = entradas
    .filter((e) => e.status === "paid" && e.paidAt && new Date(e.paidAt) >= startOfMonth(0) && new Date(e.paidAt) <= endOfMonth(0))
    .reduce((s, e) => s + Number(e.amount), 0);
  const currentMonthDespesa = expenseRows
    .filter((e) => e.status === "paid" && e.paidAt && new Date(e.paidAt) >= startOfMonth(0) && new Date(e.paidAt) <= endOfMonth(0))
    .reduce((s, e) => s + Number(e.amount), 0);

  return {
    entradas,
    saidas: expenseRows,
    totalRecebido,
    totalPendenteEntrada,
    totalAtrasadoEntrada,
    totalPagoSaida,
    totalPendenteSaida,
    totalAtrasadoSaida,
    lucro,
    cashFlow,
    currentMonthReceita,
    currentMonthDespesa,
    currentMonthLucro: currentMonthReceita - currentMonthDespesa,
  };
}

export type FinanceOverview = Awaited<ReturnType<typeof getFinanceOverview>>;
