"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Building2, Mail, MessageCircle, Tag } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/input";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import type { Client } from "@/db/schema";
import { Users } from "lucide-react";

type ClientRow = Client & { projectsCount: number; quotesCount: number };

export default function ClientesPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [sort, setSort] = useState<"recent" | "name" | "company">("recent");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    params.set("sort", sort);
    const res = await fetch(`/api/clients?${params.toString()}`);
    const data = await res.json();
    setClients(data.clients ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, sort]);

  const activeCount = useMemo(() => clients.filter((c) => c.status === "active").length, [clients]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Relacionamento"
        title="Clientes"
        description={`${clients.length} clientes cadastrados · ${activeCount} ativos`}
        action={
          <Button onClick={() => { setEditingClient(null); setDialogOpen(true); }}>
            <Plus size={16} /> Novo cliente
          </Button>
        }
      />

      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, empresa, e-mail, documento..."
            className="h-10 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-muted)] pl-10 pr-3 text-sm outline-none transition focus:border-brand-400"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="sm:w-40">
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="sm:w-44">
          <option value="recent">Mais recentes</option>
          <option value="name">Nome (A-Z)</option>
          <option value="company">Empresa (A-Z)</option>
        </Select>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="mt-3 h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-24" />
            </Card>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado"
          description="Ajuste os filtros ou cadastre um novo cliente para começar."
          action={<Button onClick={() => setDialogOpen(true)}><Plus size={16} /> Cadastrar cliente</Button>}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {clients.map((client) => (
            <motion.div
              key={client.id}
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            >
              <Link href={`/clientes/${client.id}`}>
                <Card className="group h-full p-5 transition hover:shadow-[var(--shadow-brand-md)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} color={client.avatarColor} size={44} />
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-semibold text-[var(--text-primary)]">{client.name}</p>
                        {client.company ? (
                          <p className="flex items-center gap-1 truncate text-xs text-[var(--text-tertiary)]">
                            <Building2 size={11} /> {client.company}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <Badge tone={client.status === "active" ? "success" : "neutral"}>
                      {client.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-[var(--text-secondary)]">
                    {client.email ? (
                      <p className="flex items-center gap-1.5 truncate"><Mail size={12} /> {client.email}</p>
                    ) : null}
                    {client.whatsapp ? (
                      <p className="flex items-center gap-1.5 truncate"><MessageCircle size={12} /> {client.whatsapp}</p>
                    ) : null}
                  </div>

                  {client.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {client.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600">
                          <Tag size={9} /> {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-[11px] text-[var(--text-tertiary)]">
                    <span>{client.projectsCount} projeto(s)</span>
                    <span>{client.quotesCount} orçamento(s)</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <ClientFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        client={editingClient}
        onSaved={load}
      />
    </div>
  );
}
