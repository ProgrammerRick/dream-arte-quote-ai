"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:flex">
      <div className="flex h-20 items-center px-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
        <p className="px-2 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          Navegação
        </p>
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                active
                  ? "text-brand-700"
                  : "text-[var(--text-secondary)] hover:bg-brand-50/70 hover:text-brand-700",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-brand-100/80"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                  active ? "bg-white text-brand-600 shadow-[var(--shadow-brand-sm)]" : "text-[var(--text-tertiary)] group-hover:text-brand-600",
                )}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-4 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-ink-950 p-4 text-white shadow-[var(--shadow-brand-md)]">
        <Sparkles size={18} className="mb-2 opacity-90" />
        <p className="font-display text-sm font-semibold leading-snug">Dream Arte</p>
        <p className="mt-1 text-xs leading-relaxed text-white/75">
          Estrutura pronta para autenticação e novos módulos.
        </p>
      </div>
    </aside>
  );
}
