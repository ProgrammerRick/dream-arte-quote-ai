"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Wallet,
  Users,
  UserX,
  FolderKanban,
  CheckCircle2,
  AlarmClockOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export type StatDefinition = {
  key: string;
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  tone: "brand" | "success" | "warning" | "danger" | "neutral";
  helper?: string;
};

const TONE_ICON_BG: Record<StatDefinition["tone"], string> = {
  brand: "bg-brand-100 text-brand-600",
  success: "bg-emerald-100 text-emerald-600",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-rose-100 text-rose-600",
  neutral: "bg-slate-100 text-slate-600",
};

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export function buildDashboardStats(overview: {
  totalFaturado: number;
  variacaoMensal: number;
  clientesAtivos: number;
  clientesInativos: number;
  projetosAtivos: number;
  projetosFinalizados: number;
  projetosAtrasados: number;
  proximosVencimentos: unknown[];
}): StatDefinition[] {
  return [
    {
      key: "faturado",
      label: "Total faturado",
      value: formatCurrency(overview.totalFaturado),
      icon: Wallet,
      trend: overview.variacaoMensal,
      tone: "brand",
      helper: "Acumulado recebido",
    },
    {
      key: "clientes-ativos",
      label: "Clientes ativos",
      value: formatNumber(overview.clientesAtivos),
      icon: Users,
      tone: "success",
      helper: "Em relacionamento contínuo",
    },
    {
      key: "clientes-inativos",
      label: "Clientes inativos",
      value: formatNumber(overview.clientesInativos),
      icon: UserX,
      tone: "neutral",
      helper: "Sem contratos ativos",
    },
    {
      key: "projetos-ativos",
      label: "Projetos ativos",
      value: formatNumber(overview.projetosAtivos),
      icon: FolderKanban,
      tone: "brand",
      helper: "Em desenvolvimento",
    },
    {
      key: "projetos-finalizados",
      label: "Projetos finalizados",
      value: formatNumber(overview.projetosFinalizados),
      icon: CheckCircle2,
      tone: "success",
      helper: "Entregues com sucesso",
    },
    {
      key: "projetos-atrasados",
      label: "Projetos atrasados",
      value: formatNumber(overview.projetosAtrasados),
      icon: AlarmClockOff,
      tone: "danger",
      helper: "Requerem atenção imediata",
    },
  ];
}

export function StatsGrid({ stats }: { stats: StatDefinition[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.key} variants={item}>
            <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-[var(--shadow-brand-md)]">
              <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-brand-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">{stat.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                </div>
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", TONE_ICON_BG[stat.tone])}>
                  <Icon size={20} strokeWidth={2} />
                </span>
              </div>
              <div className="relative mt-3 flex items-center gap-2 text-xs">
                {typeof stat.trend === "number" ? (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 font-semibold",
                      stat.trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
                    )}
                  >
                    {formatPercent(stat.trend, 1)}
                  </span>
                ) : null}
                <span className="text-[var(--text-tertiary)]">{stat.helper}</span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
