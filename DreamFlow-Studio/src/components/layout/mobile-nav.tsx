"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MOBILE_NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-surface fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-[var(--border-subtle)] px-1 pb-[env(safe-area-inset-bottom)] lg:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
          >
            {active ? (
              <motion.span
                layoutId="mobile-nav-active"
                className="absolute top-1 h-1 w-6 rounded-full bg-brand-600"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <Icon
              size={20}
              strokeWidth={2}
              className={cn("mt-1.5", active ? "text-brand-600" : "text-[var(--text-tertiary)]")}
            />
            <span className={cn(active ? "text-brand-700" : "text-[var(--text-tertiary)]")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
