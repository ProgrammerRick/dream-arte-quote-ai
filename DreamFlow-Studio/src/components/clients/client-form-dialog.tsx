"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, FormField } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import type { Client } from "@/db/schema";

const AVATAR_COLORS = ["#7C3AED", "#A855F7", "#9457FF", "#6D28D9", "#B385FF", "#5423B8", "#0EA5E9", "#F59E0B"];

export type ClientFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  status: "active" | "inactive";
  documentType: "cpf" | "cnpj" | "";
  documentNumber: string;
  zipCode: string;
  street: string;
  addressNumber: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  tags: string;
  notes: string;
};

function toFormValues(client?: Client | null): ClientFormValues {
  return {
    name: client?.name ?? "",
    company: client?.company ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    whatsapp: client?.whatsapp ?? "",
    status: client?.status ?? "active",
    documentType: (client?.documentType as "cpf" | "cnpj" | null) ?? "",
    documentNumber: client?.documentNumber ?? "",
    zipCode: client?.zipCode ?? "",
    street: client?.street ?? "",
    addressNumber: client?.addressNumber ?? "",
    complement: client?.complement ?? "",
    district: client?.district ?? "",
    city: client?.city ?? "",
    state: client?.state ?? "",
    tags: client?.tags?.join(", ") ?? "",
    notes: client?.notes ?? "",
  };
}

export function ClientFormDialog({
  open,
  onClose,
  client,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  client?: Client | null;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<ClientFormValues>(toFormValues(client));
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) setValues(toFormValues(client));
  }, [open, client]);

  function update<K extends keyof ClientFormValues>(key: K, value: ClientFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.name.trim()) {
      toast({ title: "Informe o nome do cliente", variant: "warning" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...values,
        documentType: values.documentType || null,
        avatarColor: client?.avatarColor ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        tags: values.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const url = client ? `/api/clients/${client.id}` : "/api/clients";
      const method = client ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast({ title: client ? "Cliente atualizado" : "Cliente cadastrado", variant: "success" });
      onSaved();
      onClose();
    } catch {
      toast({ title: "Erro ao salvar cliente", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={client ? "Editar cliente" : "Novo cliente"}
      description="Cadastro completo com dados de contato, documento e endereço."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nome completo *">
            <Input value={values.name} onChange={(e) => update("name", e.target.value)} required />
          </FormField>
          <FormField label="Empresa">
            <Input value={values.company} onChange={(e) => update("company", e.target.value)} />
          </FormField>
          <FormField label="E-mail">
            <Input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} />
          </FormField>
          <FormField label="WhatsApp">
            <Input value={values.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="(11) 99999-9999" />
          </FormField>
          <FormField label="Telefone">
            <Input value={values.phone} onChange={(e) => update("phone", e.target.value)} />
          </FormField>
          <FormField label="Status">
            <Select value={values.status} onChange={(e) => update("status", e.target.value as "active" | "inactive")}>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </Select>
          </FormField>
          <FormField label="Tipo de documento">
            <Select value={values.documentType} onChange={(e) => update("documentType", e.target.value as "cpf" | "cnpj" | "")}>
              <option value="">Selecionar</option>
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
            </Select>
          </FormField>
          <FormField label="Número do documento">
            <Input value={values.documentNumber} onChange={(e) => update("documentNumber", e.target.value)} />
          </FormField>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-600">Endereço</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FormField label="CEP" className="col-span-1">
              <Input value={values.zipCode} onChange={(e) => update("zipCode", e.target.value)} />
            </FormField>
            <FormField label="Rua" className="col-span-2">
              <Input value={values.street} onChange={(e) => update("street", e.target.value)} />
            </FormField>
            <FormField label="Número" className="col-span-1">
              <Input value={values.addressNumber} onChange={(e) => update("addressNumber", e.target.value)} />
            </FormField>
            <FormField label="Complemento" className="col-span-2">
              <Input value={values.complement} onChange={(e) => update("complement", e.target.value)} />
            </FormField>
            <FormField label="Bairro" className="col-span-2">
              <Input value={values.district} onChange={(e) => update("district", e.target.value)} />
            </FormField>
            <FormField label="Cidade" className="col-span-2">
              <Input value={values.city} onChange={(e) => update("city", e.target.value)} />
            </FormField>
            <FormField label="UF" className="col-span-1">
              <Input value={values.state} maxLength={2} onChange={(e) => update("state", e.target.value.toUpperCase())} />
            </FormField>
          </div>
        </div>

        <FormField label="Etiquetas (separadas por vírgula)">
          <Input value={values.tags} onChange={(e) => update("tags", e.target.value)} placeholder="VIP, E-commerce, Recorrente" />
        </FormField>

        <FormField label="Observações">
          <Textarea rows={3} value={values.notes} onChange={(e) => update("notes", e.target.value)} />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar cliente"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
