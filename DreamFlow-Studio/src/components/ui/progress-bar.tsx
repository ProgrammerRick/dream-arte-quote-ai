"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  trackClassName,
  gradient = true,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  gradient?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-brand-100", trackClassName)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "h-full rounded-full",
          gradient ? "bg-gradient-to-r from-brand-400 to-brand-600" : "bg-brand-500",
          className,
        )}
      />
    </div>
  );
}
