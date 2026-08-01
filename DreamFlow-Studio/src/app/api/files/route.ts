import { db } from "@/db";
import { files } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerType = searchParams.get("ownerType") as (typeof files.$inferSelect)["ownerType"] | null;
  const ownerId = searchParams.get("ownerId");

  if (!ownerType || !ownerId) {
    return Response.json({ error: "ownerType e ownerId são obrigatórios." }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(files)
    .where(and(eq(files.ownerType, ownerType), eq(files.ownerId, ownerId)))
    .orderBy(desc(files.createdAt));

  return Response.json({ files: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const [record] = await db
    .insert(files)
    .values({
      ownerType: body.ownerType,
      ownerId: body.ownerId,
      name: body.name,
      url: body.url,
      mimeType: body.mimeType ?? null,
      sizeBytes: body.sizeBytes ?? 0,
    })
    .returning();

  return Response.json({ file: record }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id obrigatório" }, { status: 400 });
  await db.delete(files).where(eq(files.id, id));
  return Response.json({ ok: true });
}
