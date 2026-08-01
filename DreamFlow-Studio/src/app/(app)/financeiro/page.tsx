import { Wallet } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Financeiro" };

export default function FinanceiroPage() {
  return (
    <ComingSoonPage
      eyebrow="Receita"
      title="Financeiro"
      description="Controle de faturamento, pagamentos recebidos, pendentes e atrasados."
      icon={Wallet}
      emptyTitle="Módulo financeiro chegando em breve"
      emptyDescription="Nesta área você poderá registrar cobranças, acompanhar fluxo de caixa detalhado e emitir relatórios financeiros da agência."
    />
  );
}
