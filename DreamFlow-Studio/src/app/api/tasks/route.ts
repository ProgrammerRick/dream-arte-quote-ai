import { db } from "@/db";
import { tasks } from "@/db/schema";
import { listTasksWithRelations } from "@/server/agenda";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listTasksWithRelations();
  return Response.json({ tasks: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const existing = await db.select().from(tasks);

  const [task] = await db
    .insert(tasks)
    .values({
      title: body.title,
      description: body.description || null,
      status: body.status ?? "todo",
      priority: body.priority ?? "medium",
      responsible: body.responsible || null,
      dueDate: body.dueDate || null,
      checklist: body.checklist ?? [],
      projectId: body.projectId || null,
      clientId: body.clientId || null,
      position: existing.length,
    })
    .returning();

  return Response.json({ task }, { status: 201 });
}
