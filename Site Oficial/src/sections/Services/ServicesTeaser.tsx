import { motion } from "framer-motion";
import { Globe, Rocket, ShoppingBag, Sparkles, ArrowUpRight, type LucideIcon } from "lucide-react";
import { servicesTeaser } from "../../config/site";
import { Reveal } from "../../components/Reveal/Reveal";
import { staggerContainer, fadeUp } from "../../animations/variants";

const icons: Record<string, LucideIcon> = { Globe, Rocket, ShoppingBag, Sparkles };

export function ServicesTeaser() {
  return (
    <section id="servicos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">
            O que fazemos
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Soluções digitais <span className="text-gradient-brand">sob medida</span> para o seu negócio
          </h2>
          <p className="mt-4 text-white/55">
            Da estratégia ao pixel final, entregamos experiências digitais que unem estética premium e performance real.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {servicesTeaser.map((service) => {
            const Icon = icons[service.icon];
            return (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.6)] transition-colors duration-300 hover:border-brand-400/40"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-600/0 blur-2xl transition-all duration-500 group-hover:bg-brand-600/30"
                  aria-hidden
                />
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-800/20 text-brand-300 ring-1 ring-inset ring-white/10">
                    {Icon && <Icon size={20} />}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{service.description}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 font-display text-xs font-semibold text-white/40 transition-colors group-hover:text-brand-300">
                  Saiba mais
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
