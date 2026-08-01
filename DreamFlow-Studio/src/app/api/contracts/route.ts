import { db } from "@/db";
import { contracts } from "@/db/schema";
import { listContractsWithClient, nextContractNumber } from "@/server/contracts";
import { logActivity } from "@/server/clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listContractsWithClient();
  return Response.json({ contracts: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const number = await nextContractNumber();

  const [contract] = await db
    .insert(contracts)
    .values({
      number,
      clientId: body.clientId,
      quoteId: body.quoteId || null,
      projectId: body.projectId || null,
      title: body.title,
      content: body.content,
      status: "draft",
      validUntil: body.validUntil || null,
    })
    .returning();

  await logActivity("contract_created", "Contrato criado", `${contract.number} — ${contract.title}`, contract.id);

  return Response.json({ contract }, { status: 201 });
}
