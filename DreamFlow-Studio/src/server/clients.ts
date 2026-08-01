import { db } from "@/db";
import { activities, clientHistory, clients, files, projects, quotes } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";

export type ClientSortKey = "recent" | "name" | "company";

export async function listClients(params: {
  search?: string;
  status?: "active" | "inactive" | "all";
  sort?: ClientSortKey;
}) {
  const { search, status = "all", sort = "recent" } = params;

  const conditions = [];
  if (search && search.trim()) {
    const like = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(clients.name, like),
        ilike(clients.company, like),
        ilike(clients.email, like),
        ilike(clients.documentNumber, like),
        ilike(clients.whatsapp, like),
      ),
    );
  }
  if (status !== "all") {
    conditions.push(eq(clients.status, status));
  }

  const rows = await db
    .select()
    .from(clients)
    .where(conditions.length ? and(...conditions) : undefined);

  const sorted = [...rows].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
    if (sort === "company") return (a.company ?? "").localeCompare(b.company ?? "", "pt-BR");
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const projectCounts = await db.select().from(projects);
  const quoteCounts = await db.select().from(quotes);

  return sorted.map((client) => ({
    ...client,
    projectsCount: projectCounts.filter((p) => p.clientId === client.id).length,
    quotesCount: quoteCounts.filter((q) => q.clientId === client.id).length,
  }));
}

export async function getClientById(id: string) {
  const [client] = await db.select().from(clients).where(eq(clients.id, id));
  if (!client) return null;

  const [history, clientFiles, clientProjects, clientQuotes] = await Promise.all([
    db.select().from(clientHistory).where(eq(clientHistory.clientId, id)).orderBy(desc(clientHistory.createdAt)),
    db.select().from(files).where(and(eq(files.ownerType, "client"), eq(files.ownerId, id))).orderBy(desc(files.createdAt)),
    db.select().from(projects).where(eq(projects.clientId, id)).orderBy(desc(projects.createdAt)),
    db.select().from(quotes).where(eq(quotes.clientId, id)).orderBy(desc(quotes.createdAt)),
  ]);

  return { client, history, files: clientFiles, projects: clientProjects, quotes: clientQuotes };
}

export async function addClientHistoryEntry(clientId: string, type: string, description: string) {
  await db.insert(clientHistory).values({ clientId, type, description });
}

export async function logActivity(type: (typeof activities.$inferInsert)["type"], title: string, description?: string, entityId?: string) {
  await db.insert(activities).values({ type, title, description, entityId });
}
