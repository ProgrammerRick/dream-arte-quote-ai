import { db } from "@/db";
import { projectChecklistItems, projectComments, projects } from "@/db/schema";
import { getProjectById } from "@/server/projects";
import { logActivity } from "@/server/clients";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProjectById(id);
  if (!data) return Response.json({ error: "Projeto não encontrado." }, { status: 404 });
  return Response.json(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (body.checklistAdd) {
    const existing = await db.select().from(projectChecklistItems).where(eq(projectChecklistItems.projectId, id));
    await db.insert(projectChecklistItems).values({
      projectId: id,
      title: body.checklistAdd.title,
      position: existing.length,
    });
  }

  if (body.checklistToggle) {
    const [item] = await db.select().from(projectChecklistItems).where(eq(projectChecklistItems.id, body.checklistToggle.id));
    if (item) {
      await db.update(projectChecklistItems).set({ done: !item.done }).where(eq(projectChecklistItems.id, item.id));
    }
  }

  if (body.checklistRemove) {
    await db.delete(projectChecklistItems).where(eq(projectChecklistItems.id, body.checklistRemove.id));
  }

  if (body.commentAdd) {
    await db.insert(projectComments).values({
      projectId: id,
      author: body.commentAdd.author || "Equipe",
      message: body.commentAdd.message,
    });
  }

  if (body.status || typeof body.progress === "number" || body.name || body.priority) {
    const updates: Partial<typeof projects.$inferInsert> = { updatedAt: new Date() };
    const fields = [
      "name", "description", "status", "priority", "budget", "progress", "startDate", "dueDate",
      "completedAt", "responsible", "domain", "hostingProvider", "sslStatus", "sslExpiresAt",
      "dnsProvider", "wordpressInstalled", "pluginsNote", "ftpHost", "ftpUser", "ftpPort",
    ] as const;
    for (const field of fields) {
      if (field in body) (updates as Record<string, unknown>)[field] = body[field];
    }
    await db.update(projects).set(updates).where(eq(projects.id, id));

    if (body.status) {
      await logActivity("project_status_changed", "Status do projeto atualizado", `Projeto atualizado para "${body.status}".`, id);
    }
  }

  const data = await getProjectById(id);
  return Response.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(projects).where(eq(projects.id, id));
  return Response.json({ ok: true });
}
