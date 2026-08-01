"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { findNavItem } from "@/lib/nav";

export function Breadcrumbs() {
  const pathname = usePathname();
  const current = findNavItem(pathname);

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
      <Link href="/" className="flex items-center gap-1 transition hover:text-brand-600">
        <Home size={14} />
        <span className="hidden sm:inline">Início</span>
      </Link>
      {current && current.href !== "/" ? (
        <>
          <ChevronRight size={14} />
          <span className="font-medium text-[var(--text-primary)]">{current.label}</span>
        </>
      ) : null}
    </nav>
  );
}
