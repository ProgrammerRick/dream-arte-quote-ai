import { motion } from "framer-motion";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { heroContent } from "../../config/site";
import { Button } from "../Button/Button";
import { HeroBackground } from "./HeroBackground";
import { HeroVisual } from "./HeroVisual";
import { staggerContainer, fadeUp } from "../../animations/variants";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] w-full items-center overflow-hidden pt-28 pb-16 sm:pt-32">
      <HeroBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left"
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lilac-300 shadow-[0_0_10px_2px_rgba(217,194,255,0.8)]" />
            <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              {heroContent.eyebrow}
            </span>
          </motion.div>

          <h1 className="font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
            <motion.span variants={fadeUp} className="block">
              {heroContent.headline[0]}
            </motion.span>
            <motion.span variants={fadeUp} className="text-gradient-brand block animate-gradient-x bg-[length:200%_auto]">
              {heroContent.headline[1]}
            </motion.span>
            <motion.span variants={fadeUp} className="block">
              {heroContent.headline[2]}
            </motion.span>
            <motion.span variants={fadeUp} className="text-gradient-brand block animate-gradient-x bg-[length:200%_auto]">
              {heroContent.headline[3]}
            </motion.span>
          </h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            {heroContent.subheadline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex w-full flex-col gap-3.5 sm:flex-row sm:w-auto">
            <Button href={heroContent.ctaPrimary.href} size="lg" icon={<ArrowRight size={18} />}>
              {heroContent.ctaPrimary.label}
            </Button>
            <Button href={heroContent.ctaSecondary.href} size="lg" variant="secondary" icon={<Play size={16} />} iconPosition="left">
              {heroContent.ctaSecondary.label}
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-14 grid w-full grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4"
          >
            {heroContent.stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <HeroVisual />
      </div>

      <motion.a
        href="#servicos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/80 sm:flex"
        aria-label="Rolar para a próxima seção"
      >
        <span className="font-display text-[10px] uppercase tracking-[0.3em]">Rolar</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}
