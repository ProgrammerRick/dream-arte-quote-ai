import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface SharedProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  className?: string;
}

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps> & {
    href?: string;
  };

const baseStyles =
  "group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900";

const sizeStyles: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 text-white shadow-[0_8px_30px_-8px_rgba(147,51,234,0.65)] hover:shadow-[0_8px_40px_-6px_rgba(147,51,234,0.85)]",
  secondary: "glass-panel text-white hover:border-white/25 hover:bg-white/10",
  ghost: "text-white/80 hover:text-white",
};

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", href, icon, iconPosition = "right", children, className, ...props }, ref) => {
    const classes = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

    const content = (
      <>
        <span className="relative z-10 flex items-center gap-2">
          {icon && iconPosition === "left" && (
            <span className="transition-transform duration-300 group-hover:-translate-x-0.5">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>
          )}
        </span>
        {variant === "primary" && (
          <span className="absolute inset-0 -z-0 rounded-full bg-gradient-to-r from-lilac-400 via-brand-400 to-brand-600 opacity-0 blur transition-opacity duration-500 group-hover:opacity-60" />
        )}
      </>
    );

    const motionProps = {
      whileHover: { y: -2, scale: 1.015 },
      whileTap: { scale: 0.97 },
      transition: { type: "spring" as const, stiffness: 400, damping: 20 },
      className: classes,
    };

    if (href) {
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          {...motionProps}
          {...(props as Record<string, unknown>)}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        {...motionProps}
        {...(props as Record<string, unknown>)}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
