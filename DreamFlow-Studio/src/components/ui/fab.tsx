"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Fab({
  onClick,
  label = "Nova ação",
  className,
}: {
  onClick?: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      aria-label={label}
      className={cn(
        "fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[var(--shadow-brand-lg)] sm:bottom-8 sm:right-8",
        className,
      )}
    >
      <Plus size={24} strokeWidth={2.25} />
    </motion.button>
  );
}
