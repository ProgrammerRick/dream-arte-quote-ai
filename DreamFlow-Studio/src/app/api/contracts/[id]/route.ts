import { db } from "@/db";
import { contracts } from "@/db/schema";
import { getContractById } from "@/server/contracts";
import { logActivity } from "@/server/clients";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getContractById(id);
  if (!data) return Response.json({ error: "Contrato não encontrado." }, { status: 404 });
  return Response.json(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updates: Partial<typeof contracts.$inferInsert> = { updatedAt: new Date() };
  const fields = ["title", "content", "status", "validUntil", "signatureName", "signatureDataUrl"] as const;
  for (const field of fields) {
    if (field in body) (updates as Record<string, unknown>)[field] = body[field];
  }
  if (body.status === "signed") {
    updates.signedAt = new Date();
  }

  await db.update(contracts).set(updates).where(eq(contracts.id, id));

  if (body.status === "signed") {
    await logActivity("contract_signed", "Contrato assinado", undefined, id);
  }

  const data = await getContractById(id);
  return Response.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(contracts).where(eq(contracts.id, id));
  return Response.json({ ok: true });
}
