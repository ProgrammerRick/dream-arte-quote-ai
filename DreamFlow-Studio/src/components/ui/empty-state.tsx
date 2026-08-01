import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-14 text-center animate-fade-in",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-[var(--shadow-brand-sm)]">
        <Icon size={26} strokeWidth={1.75} />
      </div>
      <p className="font-display text-base font-semibold text-[var(--text-primary)]">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
