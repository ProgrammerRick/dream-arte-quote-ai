import { db } from "@/db";
import { projects } from "@/db/schema";
import { listProjectsWithClient } from "@/server/projects";
import { logActivity } from "@/server/clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listProjectsWithClient();
  return Response.json({ projects: rows });
}

export async function POST(request: Request) {
  const body = await request.json();

  const [project] = await db
    .insert(projects)
    .values({
      clientId: body.clientId,
      name: body.name,
      description: body.description || null,
      status: body.status ?? "active",
      priority: body.priority ?? "medium",
      budget: String(body.budget ?? 0),
      progress: body.progress ?? 0,
      startDate: body.startDate || null,
      dueDate: body.dueDate || null,
      responsible: body.responsible || null,
      domain: body.domain || null,
      hostingProvider: body.hostingProvider || null,
      sslStatus: body.sslStatus ?? "none",
      sslExpiresAt: body.sslExpiresAt || null,
      dnsProvider: body.dnsProvider || null,
      wordpressInstalled: Boolean(body.wordpressInstalled),
      pluginsNote: body.pluginsNote || null,
      ftpHost: body.ftpHost || null,
      ftpUser: body.ftpUser || null,
      ftpPort: body.ftpPort || null,
    })
    .returning();

  await logActivity("project_created", "Novo projeto criado", project.name, project.id);

  return Response.json({ project }, { status: 201 });
}
