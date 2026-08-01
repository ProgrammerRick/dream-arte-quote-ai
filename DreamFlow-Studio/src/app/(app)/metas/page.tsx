import { Target } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Metas" };

export default function MetasPage() {
  return (
    <ComingSoonPage
      eyebrow="Objetivos"
      title="Metas"
      description="Defina e acompanhe metas de faturamento, novos clientes e entregas."
      icon={Target}
      emptyTitle="Gestão de metas chegando em breve"
      emptyDescription="Em breve você poderá criar metas personalizadas e acompanhar o progresso da agência em tempo real."
    />
  );
}
