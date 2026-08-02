import { ArrowUpRight, Camera, Briefcase, PenTool } from "lucide-react";
import { siteConfig, contactInfo, navLinks } from "../../config/site";
import { Logo } from "../Header/Logo";
import { Button } from "../Button/Button";
import { Reveal } from "../Reveal/Reveal";

export function Footer() {
  return (
    <footer id="contato" className="relative border-t border-white/8 bg-ink-950 pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="glass-panel relative mx-auto -mt-32 max-w-4xl overflow-hidden rounded-3xl px-6 py-12 text-center shadow-glow-md sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-600/30 blur-[100px]" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">
            Vamos criar algo incrível
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">
            Pronto para elevar sua marca a um novo patamar digital?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/55">
            Fale com a Dream Arte e receba uma proposta personalizada para o seu projeto.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={contactInfo.whatsapp} size="lg" icon={<ArrowUpRight size={18} />}>
              Iniciar meu projeto
            </Button>
            <Button href={`mailto:${contactInfo.email}`} size="lg" variant="secondary">
              {contactInfo.email}
            </Button>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2.5">
              <Logo />
              <span className="font-display text-lg font-semibold text-white">{siteConfig.name}</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              {siteConfig.description} Uma agência digital premium dedicada a transformar marcas através do design e da tecnologia.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Camera, Briefcase, PenTool].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Rede social Dream Arte"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-brand-400/50 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">Navegação</h4>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/50 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">Contato</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li>{contactInfo.email}</li>
              <li>{contactInfo.phone}</li>
              <li>{contactInfo.address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-6 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.</p>
          <p>Feito com excelência e propósito.</p>
        </div>
      </div>
    </footer>
  );
}
