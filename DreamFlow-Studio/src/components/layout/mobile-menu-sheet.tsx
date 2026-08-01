"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileMenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <BottomSheet open={open} onClose={onClose} title="Menu completo">
      <div className="grid grid-cols-2 gap-2 pt-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex flex-col items-start gap-2 rounded-2xl border border-[var(--border-subtle)] p-3.5 transition",
                active ? "border-brand-300 bg-brand-50" : "hover:border-brand-200 hover:bg-brand-50/50",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  active ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-600",
                )}
              >
                <Icon size={17} />
              </span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</span>
              <span className="text-[11px] leading-snug text-[var(--text-tertiary)]">{item.description}</span>
            </Link>
          );
        })}
      </div>
    </BottomSheet>
  );
}
