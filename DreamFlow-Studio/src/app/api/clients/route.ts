import { db } from "@/db";
import { clients } from "@/db/schema";
import { listClients, logActivity } from "@/server/clients";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const status = (searchParams.get("status") as "active" | "inactive" | "all" | null) ?? "all";
  const sort = (searchParams.get("sort") as "recent" | "name" | "company" | null) ?? "recent";

  const rows = await listClients({ search, status, sort });
  return Response.json({ clients: rows });
}

export async function POST(request: Request) {
  const body = await request.json();

  const [client] = await db
    .insert(clients)
    .values({
      name: body.name,
      company: body.company || null,
      email: body.email || null,
      phone: body.phone || null,
      whatsapp: body.whatsapp || null,
      status: body.status ?? "active",
      avatarColor: body.avatarColor ?? "#7C3AED",
      photoUrl: body.photoUrl || null,
      documentType: body.documentType || null,
      documentNumber: body.documentNumber || null,
      zipCode: body.zipCode || null,
      street: body.street || null,
      addressNumber: body.addressNumber || null,
      complement: body.complement || null,
      district: body.district || null,
      city: body.city || null,
      state: body.state || null,
      tags: body.tags ?? [],
      notes: body.notes || null,
    })
    .returning();

  await logActivity("client_created", "Novo cliente cadastrado", `${client.name}${client.company ? ` (${client.company})` : ""} entrou na base.`, client.id);

  return Response.json({ client }, { status: 201 });
}
