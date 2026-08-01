import type { ReactNode } from "react";
import { motion, type MotionValue, useTransform } from "framer-motion";
import { cn } from "../../utils/cn";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  strength?: number;
  floatDelay?: number;
  floatDuration?: number;
}

/**
 * Card com efeito de flutuação contínua + parallax reativo ao
 * mouse, usado para compor a cena visual do Hero.
 */
export function FloatingCard({
  children,
  className,
  mouseX,
  mouseY,
  strength = 20,
  floatDelay = 0,
  floatDuration = 6,
}: FloatingCardProps) {
  const x = useTransform(mouseX, [-0.5, 0.5], [-strength, strength]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-strength, strength]);

  return (
    <motion.div style={{ x, y }} className="will-change-transform">
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
        className={cn("glass-panel-strong rounded-2xl shadow-glow-md", className)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
