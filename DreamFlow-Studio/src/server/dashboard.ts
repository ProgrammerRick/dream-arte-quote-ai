import { db } from "@/db";
import { activities, clients, goals, payments, projects } from "@/db/schema";
import { and, desc, gte, lte } from "drizzle-orm";

function monthsAgo(count: number) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - count);
  date.setHours(0, 0, 0, 0);
  return date;
}

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

function toDateStr(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getDashboardOverview() {
  const [clientRows, projectRows, paymentRows, goalRows, activityRows] = await Promise.all([
    db.select().from(clients),
    db.select().from(projects),
    db.select().from(payments),
    db.select().from(goals).orderBy(desc(goals.createdAt)),
    db.select().from(activities).orderBy(desc(activities.createdAt)).limit(8),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const clientesAtivos = clientRows.filter((c) => c.status === "active").length;
  const clientesInativos = clientRows.filter((c) => c.status === "inactive").length;

  const projetosAtivos = projectRows.filter((p) => p.status === "active").length;
  const projetosFinalizados = projectRows.filter((p) => p.status === "completed").length;
  const projetosAtrasados = projectRows.filter((p) => {
    if (p.status === "completed") return false;
    if (p.status === "delayed") return true;
    if (!p.dueDate) return false;
    return new Date(p.dueDate) < today;
  }).length;
  const projetosPausados = projectRows.filter((p) => p.status === "paused").length;

  const totalFaturado = paymentRows
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const currentMonthStart = startOfMonth(0);
  const currentMonthEnd = endOfMonth(0);
  const previousMonthStart = startOfMonth(-1);
  const previousMonthEnd = endOfMonth(-1);

  const revenueInRange = (start: Date, end: Date) =>
    paymentRows
      .filter((p) => p.status === "paid" && p.paidAt && new Date(p.paidAt) >= start && new Date(p.paidAt) <= end)
      .reduce((sum, p) => sum + Number(p.amount), 0);

  const receitaMesAtual = revenueInRange(currentMonthStart, currentMonthEnd);
  const receitaMesAnterior = revenueInRange(previousMonthStart, previousMonthEnd);
  const variacaoMensal =
    receitaMesAnterior === 0
      ? receitaMesAtual > 0
        ? 100
        : 0
      : ((receitaMesAtual - receitaMesAnterior) / receitaMesAnterior) * 100;

  const pendente = paymentRows
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const atrasado = paymentRows
    .filter((p) => p.status === "overdue")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const in14days = new Date(today);
  in14days.setDate(in14days.getDate() + 14);

  const proximosVencimentos = paymentRows
    .filter((p) => p.status !== "paid" && new Date(p.dueDate) <= in14days)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 6)
    .map((p) => {
      const client = clientRows.find((c) => c.id === p.clientId);
      return {
        id: p.id,
        description: p.description,
        amount: Number(p.amount),
        dueDate: p.dueDate,
        status: p.status,
        clientName: client?.name ?? "Cliente",
      };
    });

  const projectDeadlines = projectRows
    .filter((p) => p.status !== "completed" && p.dueDate && new Date(p.dueDate) <= in14days)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 6)
    .map((p) => {
      const client = clientRows.find((c) => c.id === p.clientId);
      return {
        id: p.id,
        name: p.name,
        dueDate: p.dueDate as string,
        status: p.status,
        clientName: client?.name ?? "Cliente",
        progress: p.progress,
      };
    });

  const monthlyRevenue = Array.from({ length: 6 }).map((_, index) => {
    const offset = 5 - index;
    const start = monthsAgo(offset);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    const receita = paymentRows
      .filter((p) => p.status === "paid" && p.paidAt && new Date(p.paidAt) >= start && new Date(p.paidAt) <= end)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const previsto = paymentRows
      .filter((p) => new Date(p.dueDate) >= start && new Date(p.dueDate) <= end)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      month: start,
      receita,
      previsto,
    };
  });

  const statusBreakdown = [
    { status: "active", label: "Ativos", value: projetosAtivos },
    { status: "completed", label: "Finalizados", value: projetosFinalizados },
    { status: "delayed", label: "Atrasados", value: projetosAtrasados },
    { status: "paused", label: "Pausados", value: projetosPausados },
  ];

  return {
    clientesAtivos,
    clientesInativos,
    totalClientes: clientRows.length,
    projetosAtivos,
    projetosFinalizados,
    projetosAtrasados,
    projetosPausados,
    totalProjetos: projectRows.length,
    totalFaturado,
    receitaMesAtual,
    receitaMesAnterior,
    variacaoMensal,
    pendente,
    atrasado,
    proximosVencimentos,
    projectDeadlines,
    monthlyRevenue,
    statusBreakdown,
    goals: goalRows.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      target: Number(g.targetAmount),
      current: Number(g.currentAmount),
      period: g.period,
    })),
    activities: activityRows,
  };
}

export type DashboardOverview = Awaited<ReturnType<typeof getDashboardOverview>>;

export async function getCalendarEvents(monthDate: Date) {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);

  const [paymentRows, projectRows] = await Promise.all([
    db
      .select()
      .from(payments)
      .where(and(gte(payments.dueDate, toDateStr(start)), lte(payments.dueDate, toDateStr(end)))),
    db
      .select()
      .from(projects)
      .where(and(gte(projects.dueDate, toDateStr(start)), lte(projects.dueDate, toDateStr(end)))),
  ]);

  const days = new Map<string, { payments: number; projects: number }>();

  for (const p of paymentRows) {
    const key = p.dueDate;
    const entry = days.get(key) ?? { payments: 0, projects: 0 };
    entry.payments += 1;
    days.set(key, entry);
  }
  for (const p of projectRows) {
    if (!p.dueDate) continue;
    const key = p.dueDate;
    const entry = days.get(key) ?? { payments: 0, projects: 0 };
    entry.projects += 1;
    days.set(key, entry);
  }

  return days;
}
