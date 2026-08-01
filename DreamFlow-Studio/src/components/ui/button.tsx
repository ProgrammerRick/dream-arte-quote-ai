import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[var(--shadow-brand-sm)] hover:shadow-[var(--shadow-brand-md)] hover:brightness-105 active:brightness-95",
  secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  ghost: "text-[var(--text-secondary)] hover:bg-brand-50 hover:text-brand-700",
  outline: "border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-brand-300 hover:bg-brand-50/60",
  danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-sm gap-2 rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
