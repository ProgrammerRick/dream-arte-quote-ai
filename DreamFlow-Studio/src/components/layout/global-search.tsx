"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, CornerDownLeft } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return NAV_ITEMS;
    const normalized = query.trim().toLowerCase();
    return NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function goTo(href: string) {
    router.push(href);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} className="max-w-xl p-0 overflow-hidden">
      <div
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((idx) => Math.min(idx + 1, results.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((idx) => Math.max(idx - 1, 0));
          } else if (event.key === "Enter" && results[activeIndex]) {
            goTo(results[activeIndex].href);
          }
        }}
      >
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-5 py-4">
          <Search size={18} className="text-brand-500" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar clientes, projetos, páginas..."
            className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <kbd className="hidden rounded-md border border-[var(--border-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--text-tertiary)] sm:block">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--text-tertiary)]">
              Nenhum resultado encontrado para “{query}”.
            </p>
          ) : (
            results.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeIndex;
              return (
                <button
                  key={item.href}
                  onClick={() => goTo(item.href)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    active ? "bg-brand-50 text-brand-700" : "text-[var(--text-primary)]",
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <Icon size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block text-xs text-[var(--text-tertiary)]">{item.description}</span>
                  </span>
                  {active ? <CornerDownLeft size={14} className="text-brand-500" /> : <ArrowRight size={14} className="text-transparent" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
}
