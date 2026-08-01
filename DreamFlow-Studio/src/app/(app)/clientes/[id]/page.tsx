"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import {
  ArrowLeft, Building2, Mail, MapPin, MessageCircle, Pencil, Plus, Tag,
  Trash2, FileText, FolderKanban, Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FileUploader, type FileItem } from "@/components/shared/file-uploader";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/format";
import type { Client, ClientHistoryEntry, Project, Quote } from "@/db/schema";
import { useRouter } from "next/navigation";

type ClientDetail = {
  client: Client;
  history: ClientHistoryEntry[];
  files: FileItem[];
  projects: Project[];
  quotes: Quote[];
};

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [note, setNote] = useState("");

  async function load() {
    const res = await fetch(`/api/clients/${id}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function addNote() {
    if (!note.trim()) return;
    await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ historyEntry: { type: "note", description: note } }),
    });
    setNote("");
    toast({ title: "Anotação adicionada", variant: "success" });
    load();
  }

  async function handleDelete() {
    if (!confirm("Deseja realmente excluir este cliente?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    toast({ title: "Cliente excluído", variant: "success" });
    router.push("/clientes");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!data) {
    return <EmptyState icon={Building2} title="Cliente não encontrado" description="Ele pode ter sido removido." />;
  }

  const { client, history, files, projects, quotes } = data;
  const address = [client.street, client.addressNumber, client.district, client.city, client.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <Link href="/clientes" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
        <ArrowLeft size={15} /> Voltar para clientes
      </Link>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={client.name} color={client.avatarColor} size={64} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold text-[var(--text-primary)]">{client.name}</h1>
                <Badge tone={client.status === "active" ? "success" : "neutral"}>
                  {client.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              {client.company ? <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{client.company}</p> : null}
              {client.documentNumber ? (
                <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">
                  {client.documentType?.toUpperCase()}: {client.documentNumber}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}><Pencil size={14} /> Editar</Button>
            <Button variant="danger" onClick={handleDelete}><Trash2 size={14} /></Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[var(--border-subtle)] pt-4 text-sm sm:grid-cols-2">
          {client.email ? <p className="flex items-center gap-2 text-[var(--text-secondary)]"><Mail size={14} className="text-brand-500" /> {client.email}</p> : null}
          {client.whatsapp ? <p className="flex items-center gap-2 text-[var(--text-secondary)]"><MessageCircle size={14} className="text-brand-500" /> {client.whatsapp}</p> : null}
          {address ? <p className="flex items-center gap-2 text-[var(--text-secondary)] sm:col-span-2"><MapPin size={14} className="text-brand-500" /> {address}{client.zipCode ? ` · CEP ${client.zipCode}` : ""}</p> : null}
        </div>

        {client.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {client.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        ) : null}

        {client.notes ? (
          <p className="mt-4 rounded-xl bg-[var(--bg-surface-muted)] p-3 text-sm text-[var(--text-secondary)]">{client.notes}</p>
        ) : null}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Histórico do cliente</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Adicionar anotação ao histórico..." className="flex-1" />
                <Button onClick={addNote} className="self-end"><Plus size={14} /></Button>
              </div>
              {history.length === 0 ? (
                <EmptyState icon={Clock} title="Sem histórico" description="Nenhuma movimentação registrada ainda." />
              ) : (
                <ul className="space-y-3 pt-2">
                  {history.map((entry) => (
                    <li key={entry.id} className="flex gap-3 border-b border-[var(--border-subtle)] pb-3 last:border-0">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                      <div>
                        <p className="text-sm text-[var(--text-primary)]">{entry.description}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">{new Date(entry.createdAt).toLocaleString("pt-BR")}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Projetos e orçamentos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {projects.length === 0 && quotes.length === 0 ? (
                <EmptyState icon={FolderKanban} title="Nada por aqui ainda" description="Crie um projeto ou orçamento para este cliente." />
              ) : (
                <>
                  {projects.map((project) => (
                    <Link key={project.id} href={`/projetos/${project.id}`} className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] p-3 text-sm transition hover:border-brand-300">
                      <span className="flex items-center gap-2 font-medium text-[var(--text-primary)]"><FolderKanban size={14} className="text-brand-500" /> {project.name}</span>
                      <Badge tone="brand">{formatCurrency(Number(project.budget))}</Badge>
                    </Link>
                  ))}
                  {quotes.map((quote) => (
                    <Link key={quote.id} href={`/orcamentos/${quote.id}`} className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] p-3 text-sm transition hover:border-brand-300">
                      <span className="flex items-center gap-2 font-medium text-[var(--text-primary)]"><FileText size={14} className="text-brand-500" /> {quote.number}</span>
                      <Badge tone="warning">{formatCurrency(Number(quote.total))}</Badge>
                    </Link>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>Arquivos</CardTitle></CardHeader>
          <CardContent>
            <FileUploader ownerType="client" ownerId={client.id} files={files} onChange={(next) => setData({ ...data, files: next })} />
          </CardContent>
        </Card>
      </div>

      <ClientFormDialog open={editOpen} onClose={() => setEditOpen(false)} client={client} onSaved={load} />
    </div>
  );
}
