import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { generatePixPayload } from "@/lib/pix";
import { formatCurrency } from "@/lib/format";

const BRAND = { r: 124, g: 58, b: 237 };
const INK = { r: 23, g: 18, b: 39 };
const MUTED = { r: 99, g: 90, b: 122 };

function drawLetterhead(doc: jsPDF, kind: string, number: string) {
  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(0, 0, 210, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Dream Arte", 16, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Criação de sites & identidade digital", 16, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(kind, 194, 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(number, 194, 23, { align: "right" });
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(230, 224, 245);
    doc.line(16, 282, 194, 282);
    doc.setFontSize(8);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text("Dream Arte — Documento gerado automaticamente pelo DreamFlow Studio", 16, 288);
    doc.text(`Página ${i} de ${pageCount}`, 194, 288, { align: "right" });
  }
}

export type QuotePdfInput = {
  number: string;
  title: string;
  status: string;
  createdAt: string | Date;
  validUntil?: string | null;
  installments: number;
  paymentMethod?: string | null;
  discountType: string;
  discountValue: number;
  subtotal: number;
  total: number;
  notes?: string | null;
  items: { description: string; quantity: number; unitPrice: number }[];
  client: { name: string; company?: string | null; email?: string | null; whatsapp?: string | null };
  pix?: { key: string; city?: string } | null;
};

export async function generateQuotePdf(data: QuotePdfInput) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  drawLetterhead(doc, "ORÇAMENTO", data.number);

  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(data.title, 16, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  const createdLabel = new Date(data.createdAt).toLocaleDateString("pt-BR");
  const validLabel = data.validUntil ? new Date(data.validUntil).toLocaleDateString("pt-BR") : "—";
  doc.text(`Emitido em: ${createdLabel}    Válido até: ${validLabel}`, 16, 53);

  doc.setFillColor(246, 243, 255);
  doc.roundedRect(16, 60, 178, 22, 3, 3, "F");
  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Cliente", 20, 67);
  doc.setFont("helvetica", "normal");
  doc.text(data.client.name + (data.client.company ? `  •  ${data.client.company}` : ""), 20, 73);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.setFontSize(9);
  doc.text([data.client.email, data.client.whatsapp].filter(Boolean).join("   •   ") || "-", 20, 79);

  autoTable(doc, {
    startY: 88,
    head: [["Descrição", "Qtd.", "Valor unit.", "Subtotal"]],
    body: data.items.map((item) => [
      item.description,
      String(item.quantity),
      formatCurrency(item.unitPrice, true),
      formatCurrency(item.quantity * item.unitPrice, true),
    ]),
    headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: [23, 18, 39] },
    alternateRowStyles: { fillColor: [250, 248, 255] },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 16, right: 16 },
  });

  const afterTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  const discountLabel =
    data.discountType === "percent" ? `${data.discountValue}%` : formatCurrency(data.discountValue, true);

  doc.setFontSize(10);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(`Subtotal: ${formatCurrency(data.subtotal, true)}`, 194, afterTableY, { align: "right" });
  doc.text(`Desconto: ${discountLabel}`, 194, afterTableY + 6, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text(`Total: ${formatCurrency(data.total, true)}`, 194, afterTableY + 15, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(INK.r, INK.g, INK.b);
  const installmentValue = data.total / Math.max(1, data.installments);
  doc.text(
    data.installments > 1
      ? `Parcelamento: ${data.installments}x de ${formatCurrency(installmentValue, true)}`
      : "Pagamento à vista",
    16,
    afterTableY + 15,
  );
  if (data.paymentMethod) {
    doc.text(`Forma de pagamento: ${data.paymentMethod}`, 16, afterTableY + 21);
  }

  let cursorY = afterTableY + 32;

  if (data.pix?.key) {
    const payload = generatePixPayload({ key: data.pix.key, name: "Dream Arte", city: data.pix.city ?? "Sao Paulo", amount: data.total });
    const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 160 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Pagamento via Pix", 16, cursorY);
    doc.addImage(qrDataUrl, "PNG", 16, cursorY + 4, 30, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const wrapped = doc.splitTextToSize(payload, 130);
    doc.text(wrapped, 52, cursorY + 12);
    cursorY += 40;
  }

  if (data.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(INK.r, INK.g, INK.b);
    doc.text("Observações", 16, cursorY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(doc.splitTextToSize(data.notes, 178), 16, cursorY + 6);
    cursorY += 20;
  }

  cursorY = Math.max(cursorY, 250);
  doc.setDrawColor(220, 210, 245);
  doc.line(16, cursorY, 90, cursorY);
  doc.line(120, cursorY, 194, cursorY);
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text("Assinatura Dream Arte", 16, cursorY + 5);
  doc.text("Assinatura do Cliente", 120, cursorY + 5);

  drawFooter(doc);
  return doc;
}

export type ContractPdfInput = {
  number: string;
  title: string;
  content: string;
  status: string;
  createdAt: string | Date;
  validUntil?: string | null;
  signedAt?: string | Date | null;
  signatureName?: string | null;
  signatureDataUrl?: string | null;
  client: { name: string; company?: string | null };
};

export function generateContractPdf(data: ContractPdfInput) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  drawLetterhead(doc, "CONTRATO", data.number);

  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(data.title, 16, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  const createdLabel = new Date(data.createdAt).toLocaleDateString("pt-BR");
  const validLabel = data.validUntil ? new Date(data.validUntil).toLocaleDateString("pt-BR") : "Indeterminado";
  doc.text(`Emitido em: ${createdLabel}    Validade: ${validLabel}    Status: ${data.status.toUpperCase()}`, 16, 52);

  doc.setFontSize(10);
  doc.setTextColor(INK.r, INK.g, INK.b);
  const lines = doc.splitTextToSize(data.content, 178);
  doc.text(lines, 16, 62);

  let y = 62 + lines.length * 5 + 12;
  if (y > 250) {
    doc.addPage();
    y = 30;
  }

  doc.setDrawColor(220, 210, 245);
  doc.line(16, y, 90, y);
  doc.line(120, y, 194, y);
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text("Dream Arte (Contratada)", 16, y + 5);
  doc.text(data.client.name + " (Contratante)", 120, y + 5);

  if (data.signatureDataUrl) {
    doc.addImage(data.signatureDataUrl, "PNG", 120, y - 22, 55, 20);
    doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    doc.setFontSize(8);
    doc.text(`Assinado digitalmente por ${data.signatureName ?? data.client.name}`, 120, y + 10);
  }

  drawFooter(doc);
  return doc;
}
