import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { useMousePosition } from "../../hooks/useMousePosition";
import { FloatingCard } from "./FloatingCard";

export function HeroVisual() {
  const { x, y } = useMousePosition();

  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-lg items-center justify-center sm:h-[480px] lg:h-[560px] lg:max-w-none">
      {/* Central mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="relative z-10 w-[78%] max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-glow-lg sm:w-[70%]"
      >
        <img
          src="/images/hero-mockup-dashboard.jpg"
          alt="Mockup de dashboard de site premium criado pela Dream Arte"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
      </motion.div>

      {/* Floating mobile mockup */}
      <div className="absolute -right-2 bottom-6 z-20 w-[38%] max-w-[180px] sm:right-2 sm:w-[32%] lg:right-6">
        <FloatingCard mouseX={x} mouseY={y} strength={26} floatDuration={7} className="overflow-hidden rounded-2xl p-0">
          <img
            src="/images/hero-mockup-mobile.jpg"
            alt="Mockup de aplicativo mobile premium criado pela Dream Arte"
            className="aspect-[9/16] w-full object-cover"
            loading="eager"
          />
        </FloatingCard>
      </div>

      {/* Stat card */}
      <div className="absolute -left-2 top-4 z-20 sm:left-0 lg:-left-8">
        <FloatingCard mouseX={x} mouseY={y} strength={16} floatDelay={0.5} className="px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white">
              <TrendingUp size={16} />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-white">+180%</p>
              <p className="text-[11px] text-white/60">conversão média</p>
            </div>
          </div>
        </FloatingCard>
      </div>

      {/* Badge card */}
      <div className="absolute bottom-0 left-1/2 z-20 hidden -translate-x-[110%] sm:bottom-2 sm:block">
        <FloatingCard mouseX={x} mouseY={y} strength={12} floatDelay={1.1} floatDuration={5.5} className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-lilac-300" />
            <p className="font-display text-xs font-semibold text-white/90">Design premium</p>
          </div>
        </FloatingCard>
      </div>

      {/* Performance badge */}
      <div className="absolute right-0 top-0 z-20 hidden sm:right-4 sm:block">
        <FloatingCard mouseX={x} mouseY={y} strength={14} floatDelay={0.8} floatDuration={6.5} className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Zap size={16} className="text-gold-400" />
            <p className="font-display text-xs font-semibold text-white/90">99 Performance</p>
          </div>
        </FloatingCard>
      </div>

      {/* Decorative ring */}
      <motion.div
        className="absolute h-[85%] w-[85%] rounded-full border border-dashed border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
