"use client";

import { useRef, useState } from "react";
import { File as FileIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export type OwnerType = "client" | "project" | "quote" | "contract" | "resource";

export type FileItem = {
  id: string;
  name: string;
  url: string;
  mimeType: string | null;
  sizeBytes: number;
  createdAt: string | Date;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploader({
  ownerType,
  ownerId,
  files,
  onChange,
  className,
}: {
  ownerType: OwnerType;
  ownerId: string;
  files: FileItem[];
  onChange: (files: FileItem[]) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("upload failed");
        const uploaded = await uploadRes.json();

        const recordRes = await fetch("/api/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerType, ownerId, ...uploaded }),
        });
        const { file: record } = await recordRes.json();
        onChange([record, ...files]);
      }
      toast({ title: "Arquivo enviado", variant: "success" });
    } catch {
      toast({ title: "Falha ao enviar arquivo", variant: "error" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    onChange(files.filter((f) => f.id !== id));
    await fetch(`/api/files?id=${id}`, { method: "DELETE" });
  }

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/40 px-4 py-6 text-sm font-medium text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-60"
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
        {uploading ? "Enviando..." : "Enviar arquivo"}
      </button>
      <input ref={inputRef} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] p-2.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <FileIcon size={16} />
              </span>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)] hover:text-brand-700"
              >
                {file.name}
              </a>
              <span className="shrink-0 text-xs text-[var(--text-tertiary)]">{formatSize(file.sizeBytes)}</span>
              <button
                type="button"
                onClick={() => handleDelete(file.id)}
                className="shrink-0 rounded-lg p-1.5 text-[var(--text-tertiary)] transition hover:bg-rose-50 hover:text-rose-600"
                aria-label="Remover arquivo"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
