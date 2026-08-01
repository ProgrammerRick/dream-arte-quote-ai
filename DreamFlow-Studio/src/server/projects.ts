import { db } from "@/db";
import {
  clients,
  files,
  projectChecklistItems,
  projectComments,
  projects,
} from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function listProjectsWithClient() {
  const rows = await db
    .select({ project: projects, client: clients })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .orderBy(desc(projects.createdAt));

  return rows.map((row) => ({ ...row.project, client: row.client }));
}

export async function getProjectById(id: string) {
  const [row] = await db
    .select({ project: projects, client: clients })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.id, id));

  if (!row) return null;

  const [checklist, comments, projectFiles] = await Promise.all([
    db
      .select()
      .from(projectChecklistItems)
      .where(eq(projectChecklistItems.projectId, id))
      .orderBy(projectChecklistItems.position),
    db.select().from(projectComments).where(eq(projectComments.projectId, id)).orderBy(desc(projectComments.createdAt)),
    db.select().from(files).where(and(eq(files.ownerType, "project"), eq(files.ownerId, id))).orderBy(desc(files.createdAt)),
  ]);

  return { project: row.project, client: row.client, checklist, comments, files: projectFiles };
}

export function computeProgressFromChecklist(items: { done: boolean }[]) {
  if (items.length === 0) return null;
  const done = items.filter((i) => i.done).length;
  return Math.round((done / items.length) * 100);
}
