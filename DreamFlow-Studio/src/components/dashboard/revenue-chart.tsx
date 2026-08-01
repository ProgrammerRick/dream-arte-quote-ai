"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatMonthLabel } from "@/lib/format";

type MonthlyPoint = {
  month: Date;
  receita: number;
  previsto: number;
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-white/95 p-3 text-xs shadow-[var(--shadow-brand-md)] backdrop-blur">
      <p className="mb-1.5 font-semibold text-[var(--text-primary)]">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-1.5" style={{ color: entry.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: entry.color }} />
          {entry.name}: <span className="font-semibold">{formatCurrency(entry.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  const chartData = data.map((point) => ({
    label: formatMonthLabel(point.month),
    Receita: point.receita,
    Previsto: point.previsto,
  }));

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <div>
          <CardTitle>Receita mensal</CardTitle>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Recebido vs. previsto nos últimos 6 meses</p>
        </div>
        <Badge tone="brand">Fluxo financeiro</Badge>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="h-72 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="previstoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C4B5FD" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="#EEE7FF" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#9992AC", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#9992AC", fontSize: 12 }}
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Previsto"
                stroke="#C4B5FD"
                strokeWidth={2}
                fill="url(#previstoGradient)"
              />
              <Area
                type="monotone"
                dataKey="Receita"
                stroke="#7C3AED"
                strokeWidth={2.5}
                fill="url(#receitaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
