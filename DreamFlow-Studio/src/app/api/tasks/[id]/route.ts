import { db } from "@/db";
import { tasks } from "@/db/schema";
import { logActivity } from "@/server/clients";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const [current] = await db.select().from(tasks).where(eq(tasks.id, id));
  if (!current) return Response.json({ error: "Tarefa não encontrada." }, { status: 404 });

  if (body.timerAction === "start") {
    await db.update(tasks).set({ timerStartedAt: new Date() }).where(eq(tasks.id, id));
  } else if (body.timerAction === "stop" && current.timerStartedAt) {
    const elapsed = Math.round((Date.now() - new Date(current.timerStartedAt).getTime()) / 1000);
    await db
      .update(tasks)
      .set({ timerStartedAt: null, timeSpentSeconds: current.timeSpentSeconds + elapsed })
      .where(eq(tasks.id, id));
  }

  if (body.checklistToggleIndex !== undefined) {
    const checklist = [...current.checklist];
    if (checklist[body.checklistToggleIndex]) {
      checklist[body.checklistToggleIndex] = {
        ...checklist[body.checklistToggleIndex],
        done: !checklist[body.checklistToggleIndex].done,
      };
    }
    await db.update(tasks).set({ checklist }).where(eq(tasks.id, id));
  }

  if (body.checklistAdd) {
    const checklist = [...current.checklist, { text: body.checklistAdd, done: false }];
    await db.update(tasks).set({ checklist }).where(eq(tasks.id, id));
  }

  const updates: Partial<typeof tasks.$inferInsert> = {};
  const fields = ["title", "description", "status", "priority", "responsible", "dueDate", "position"] as const;
  for (const field of fields) {
    if (field in body) (updates as Record<string, unknown>)[field] = body[field];
  }
  if (Object.keys(updates).length > 0) {
    updates.updatedAt = new Date();
    await db.update(tasks).set(updates).where(eq(tasks.id, id));
  }

  if (body.status === "done" && current.status !== "done") {
    await logActivity("task_completed", "Tarefa concluída", current.title, id);
  }

  const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
  return Response.json({ task });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(tasks).where(eq(tasks.id, id));
  return Response.json({ ok: true });
}
