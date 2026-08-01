"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GlobalSearch } from "@/components/layout/global-search";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/components/layout/logo";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="glass-surface sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--border-subtle)] px-4 sm:h-20 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <Logo compact />
      </div>

      <div className="hidden flex-1 lg:block">
        <Breadcrumbs />
      </div>

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="ml-auto flex flex-1 items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-muted)] px-3.5 py-2.5 text-sm text-[var(--text-tertiary)] transition hover:border-brand-300 sm:max-w-xs lg:ml-0 lg:flex-none"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Pesquisar...</span>
        <kbd className="ml-auto hidden rounded-md border border-[var(--border-subtle)] bg-white px-1.5 py-0.5 text-[10px] sm:block">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        aria-label="Notificações"
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--text-secondary)] transition hover:bg-brand-50 hover:text-brand-700"
      >
        <Bell size={18} />
        <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
      </button>

      <button
        type="button"
        aria-label="Menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--text-secondary)] transition hover:bg-brand-50 hover:text-brand-700 lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="hidden shrink-0 items-center gap-2.5 border-l border-[var(--border-subtle)] pl-4 lg:flex">
        <Avatar name="Dream Arte" size={38} />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Equipe Dream Arte</p>
          <p className="text-xs text-[var(--text-tertiary)]">Workspace principal</p>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
