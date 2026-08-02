/**
 * ============================================================
 *  DREAM ARTE — CONFIGURAÇÃO CENTRAL DO SITE
 * ============================================================
 * Todo o conteúdo textual, links e dados de contato da agência
 * ficam centralizados aqui para facilitar futuras edições sem
 * precisar mexer nos componentes.
 * ============================================================
 */

export const siteConfig = {
  name: "Dream Arte",
  shortName: "Dream Arte",
  tagline: "Agência Digital Premium",
  description:
    "Criamos sites e experiências digitais exclusivas que elevam marcas e geram resultados reais.",
  url: "https://dreamarte.com.br",
  locale: "pt-BR",
};

export const contactInfo = {
  email: "contato@dreamarte.com.br",
  phone: "+55 (11) 99999-0000",
  whatsapp: "https://wa.me/5511999990000",
  address: "São Paulo, SP — Atendimento em todo o Brasil",
};

export const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/dreamarte" },
  { name: "LinkedIn", href: "https://linkedin.com/company/dreamarte" },
  { name: "Behance", href: "https://behance.net/dreamarte" },
  { name: "WhatsApp", href: contactInfo.whatsapp },
];

export const navLinks = [
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Processo", href: "#processo" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

export const heroContent = {
  eyebrow: "Agência digital premium de criação de sites",
  headline: ["Sites que parecem", "arte.", "Resultados que", "parecem ciência."],
  subheadline:
    "A Dream Arte projeta experiências digitais sofisticadas — do design à performance — para marcas que não aceitam o comum.",
  ctaPrimary: { label: "Solicitar orçamento", href: "#contato" },
  ctaSecondary: { label: "Ver portfólio", href: "#portfolio" },
  stats: [
    { value: "120+", label: "Projetos entregues" },
    { value: "98%", label: "Clientes satisfeitos" },
    { value: "4.9/5", label: "Avaliação média" },
    { value: "7 dias", label: "Prazo médio de entrega" },
  ],
};

export const servicesTeaser = [
  {
    title: "Sites Institucionais",
    description:
      "Presença digital sofisticada que comunica autoridade e constrói confiança instantânea.",
    icon: "Globe",
  },
  {
    title: "Landing Pages",
    description:
      "Páginas de alta conversão desenhadas com estratégia, copy e UX orientados a resultado.",
    icon: "Rocket",
  },
  {
    title: "E-commerce",
    description:
      "Lojas virtuais premium com experiência de compra fluida do primeiro clique à conversão.",
    icon: "ShoppingBag",
  },
  {
    title: "Identidade Digital",
    description:
      "Branding, UI Kits e sistemas de design consistentes para marcas de alto padrão.",
    icon: "Sparkles",
  },
];
