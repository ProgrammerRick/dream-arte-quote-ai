import { ShieldCheck, Gauge, Headset, Sparkles } from "lucide-react";
import { Reveal } from "../Reveal/Reveal";

const items = [
  { icon: ShieldCheck, label: "Segurança SSL em todos os projetos" },
  { icon: Gauge, label: "Performance otimizada (Core Web Vitals)" },
  { icon: Headset, label: "Suporte dedicado pós-entrega" },
  { icon: Sparkles, label: "Design 100% exclusivo e sob medida" },
];

export function TrustBar() {
  return (
    <section className="relative border-y border-white/6 bg-white/[0.02] py-8">
      <Reveal>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 sm:grid-cols-4 sm:gap-6 sm:px-8">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 sm:justify-center">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-300 ring-1 ring-inset ring-white/10">
                <Icon size={16} />
              </span>
              <p className="text-xs font-medium leading-snug text-white/60 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
