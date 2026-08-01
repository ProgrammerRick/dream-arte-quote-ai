import { FolderKanban } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Projetos" };

export default function ProjetosPage() {
  return (
    <ComingSoonPage
      eyebrow="Produção"
      title="Projetos"
      description="Quadro completo de projetos de criação de sites, prazos e progresso."
      icon={FolderKanban}
      emptyTitle="Módulo de projetos chegando em breve"
      emptyDescription="Aqui você vai gerenciar projetos em formato Kanban, com prazos, prioridades, progresso e vínculo direto com clientes e financeiro."
    />
  );
}
