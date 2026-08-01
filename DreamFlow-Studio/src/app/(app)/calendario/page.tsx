import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Calendário" };

export default function CalendarioPage() {
  return (
    <ComingSoonPage
      eyebrow="Organização"
      title="Calendário"
      description="Visão completa de prazos de projetos e vencimentos financeiros."
      icon={CalendarDays}
      emptyTitle="Calendário completo chegando em breve"
      emptyDescription="Em breve você terá um calendário mensal completo com todos os prazos de entrega e vencimentos financeiros da agência."
    />
  );
}
