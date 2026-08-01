import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "success" | "warning" | "danger" | "neutral";

const TONE_STYLES: Record<BadgeTone, string> = {
  brand: "bg-brand-100 text-brand-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-600",
};

export function Badge({
  tone = "brand",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none",
        TONE_STYLES[tone],
        className,
      )}
      {...props}
    />
  );
}
