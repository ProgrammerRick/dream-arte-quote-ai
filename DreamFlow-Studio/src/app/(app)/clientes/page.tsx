import { Users } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Clientes" };

export default function ClientesPage() {
  return (
    <ComingSoonPage
      eyebrow="Relacionamento"
      title="Clientes"
      description="Cadastro completo, histórico e status de todos os clientes da Dream Arte."
      icon={Users}
      emptyTitle="Módulo de clientes chegando em breve"
      emptyDescription="Nesta área você poderá cadastrar, editar e acompanhar todos os clientes da agência, com filtros por status e histórico de projetos."
    />
  );
}
