import { motion } from "framer-motion";

/**
 * Camadas de fundo do Hero: grid tecnológico, blobs de gradiente
 * e brilho ambiente — cria profundidade sem pesar performance.
 */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#33115f_0%,#0b0612_55%)]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-30 mask-fade-b" />

      {/* Animated blobs */}
      <motion.div
        className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-brand-600/30 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full bg-lilac-500/25 blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-brand-800/40 blur-[100px]"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise */}
      <div className="noise-overlay absolute inset-0" />

      {/* Bottom fade to page background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-900" />
    </div>
  );
}
