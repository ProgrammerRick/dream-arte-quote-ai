import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { fadeUp } from "../../animations/variants";
import { cn } from "../../utils/cn";

interface RevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
}

/**
 * Componente utilitário para animações de "fade reveal" ao rolar
 * a página, usado em praticamente todas as seções do site.
 */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  once = true,
  amount = 0.25,
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
