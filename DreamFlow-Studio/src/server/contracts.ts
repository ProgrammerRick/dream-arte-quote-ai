import { db } from "@/db";
import { clients, contracts, projects, quotes } from "@/db/schema";
import { desc, eq, gte, sql } from "drizzle-orm";

export async function nextContractNumber() {
  const year = new Date().getFullYear();
  const startOfYear = `${year}-01-01`;
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contracts)
    .where(gte(contracts.createdAt, new Date(startOfYear)));
  const sequence = (count ?? 0) + 1;
  return `CTR-${year}-${String(sequence).padStart(4, "0")}`;
}

export async function listContractsWithClient() {
  const rows = await db
    .select({ contract: contracts, client: clients })
    .from(contracts)
    .leftJoin(clients, eq(contracts.clientId, clients.id))
    .orderBy(desc(contracts.createdAt));
  return rows.map((row) => ({ ...row.contract, client: row.client }));
}

export async function getContractById(id: string) {
  const [row] = await db
    .select({ contract: contracts, client: clients })
    .from(contracts)
    .leftJoin(clients, eq(contracts.clientId, clients.id))
    .where(eq(contracts.id, id));
  if (!row) return null;

  const [quote] = row.contract.quoteId
    ? await db.select().from(quotes).where(eq(quotes.id, row.contract.quoteId))
    : [null];
  const [project] = row.contract.projectId
    ? await db.select().from(projects).where(eq(projects.id, row.contract.projectId))
    : [null];

  return { contract: row.contract, client: row.client, quote, project };
}

export function defaultContractTemplate(params: {
  clientName: string;
  clientDocument?: string | null;
  title: string;
  value?: number;
}) {
  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: ${params.clientName}${params.clientDocument ? ` — Documento: ${params.clientDocument}` : ""}
CONTRATADA: Dream Arte — Criação de Sites e Identidade Digital

OBJETO: O presente contrato tem como objeto a prestação de serviços referentes a "${params.title}", incluindo desenvolvimento, hospedagem inicial e suporte conforme escopo acordado entre as partes.

VALOR E FORMA DE PAGAMENTO: ${params.value ? `O valor total dos serviços é de R$ ${params.value.toFixed(2)}, ` : ""}a ser pago conforme condições definidas no orçamento vinculado a este contrato.

PRAZO: O prazo de execução será definido conforme cronograma do projeto, podendo ser renegociado mediante acordo entre as partes.

OBRIGAÇÕES DA CONTRATADA: Entregar os serviços descritos com qualidade técnica, dentro do prazo acordado, mantendo comunicação constante com o contratante.

OBRIGAÇÕES DO CONTRATANTE: Fornecer as informações e materiais necessários para a execução do projeto, além de efetuar os pagamentos nas datas acordadas.

RESCISÃO: Este contrato poderá ser rescindido por qualquer uma das partes mediante aviso prévio de 15 (quinze) dias, respeitando os valores já executados.

FORO: Fica eleito o foro da comarca da CONTRATADA para dirimir quaisquer dúvidas oriundas deste contrato.

E por estarem de acordo, as partes assinam o presente instrumento.`;
}
