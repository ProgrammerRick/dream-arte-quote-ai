import { db } from "@/db";
import { clients, events, projects, tasks } from "@/db/schema";
import { and, asc, eq, gte, lte } from "drizzle-orm";

function toDateStr(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function listTasksWithRelations() {
  const rows = await db
    .select({ task: tasks, client: clients, project: projects })
    .from(tasks)
    .leftJoin(clients, eq(tasks.clientId, clients.id))
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .orderBy(asc(tasks.position));
  return rows.map((r) => ({ ...r.task, clientName: r.client?.name ?? null, projectName: r.project?.name ?? null }));
}

export async function listEventsForMonth(monthDate: Date) {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);

  const rows = await db
    .select({ event: events, client: clients, project: projects })
    .from(events)
    .leftJoin(clients, eq(events.clientId, clients.id))
    .leftJoin(projects, eq(events.projectId, projects.id))
    .where(and(gte(events.date, toDateStr(start)), lte(events.date, toDateStr(end))))
    .orderBy(asc(events.date));

  return rows.map((r) => ({ ...r.event, clientName: r.client?.name ?? null, projectName: r.project?.name ?? null }));
}

export async function listUpcomingEvents(limit = 8) {
  const today = toDateStr(new Date());
  const rows = await db
    .select({ event: events, client: clients, project: projects })
    .from(events)
    .leftJoin(clients, eq(events.clientId, clients.id))
    .leftJoin(projects, eq(events.projectId, projects.id))
    .where(gte(events.date, today))
    .orderBy(asc(events.date))
    .limit(limit);
  return rows.map((r) => ({ ...r.event, clientName: r.client?.name ?? null, projectName: r.project?.name ?? null }));
}
