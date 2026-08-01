import { Settings } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <ComingSoonPage
      eyebrow="Sistema"
      title="Configurações"
      description="Preferências gerais, tema, notificações e autenticação futura."
      icon={Settings}
      emptyTitle="Configurações chegando em breve"
      emptyDescription="Esta área já está estruturada para receber preferências de tema claro/escuro, autenticação e configurações da equipe."
    />
  );
}
