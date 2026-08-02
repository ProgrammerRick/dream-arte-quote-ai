import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strong?: boolean;
}

/**
 * Card base com efeito glassmorphism, reutilizado em várias
 * seções do site (componente compartilhado da biblioteca de UI).
 */
export function GlassCard({ children, className, strong = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        strong ? "glass-panel-strong" : "glass-panel",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
