import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Wallet,
  CalendarDays,
  Target,
  Settings,
  FileText,
  FileSignature,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Visão geral da agência",
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users,
    description: "Gestão de clientes",
  },
  {
    label: "Projetos",
    href: "/projetos",
    icon: FolderKanban,
    description: "Sites e projetos em andamento",
  },
  {
    label: "Orçamentos",
    href: "/orcamentos",
    icon: FileText,
    description: "Propostas comerciais e cálculo automático",
  },
  {
    label: "Contratos",
    href: "/contratos",
    icon: FileSignature,
    description: "Modelos e assinatura de contratos",
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    icon: Wallet,
    description: "Faturamento e pagamentos",
  },
  {
    label: "Agenda",
    href: "/calendario",
    icon: CalendarDays,
    description: "Prazos, tarefas e compromissos",
  },
  {
    label: "Metas",
    href: "/metas",
    icon: Target,
    description: "Objetivos da agência",
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    description: "Preferências do sistema",
  },
];

/** Bottom navigation shows a focused subset for small / Android screens. */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[5],
  NAV_ITEMS[6],
];

export function findNavItem(pathname: string): NavItem | undefined {
  if (pathname === "/") return NAV_ITEMS[0];
  return NAV_ITEMS.find((item) => item.href !== "/" && pathname.startsWith(item.href));
}
