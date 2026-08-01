"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MonthComparison({
  currentLabel,
  previousLabel,
  current,
  previous,
  variacao,
}: {
  currentLabel: string;
  previousLabel: string;
  current: number;
  previous: number;
  variacao: number;
}) {
  const data = [
    { label: previousLabel, valor: previous },
    { label: currentLabel, valor: current },
  ];
  const isPositive = variacao >= 0;

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Comparação entre meses</CardTitle>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
          )}
        >
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {formatPercent(variacao, 1)}
        </span>
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }} barSize={54}>
              <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="#EEE7FF" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#9992AC", fontSize: 12 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#9992AC", fontSize: 12 }}
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                width={36}
              />
              <Tooltip
                cursor={{ fill: "rgba(124,58,237,0.06)" }}
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ borderRadius: 12, border: "1px solid rgba(124,58,237,0.12)", fontSize: 12 }}
              />
              <Bar dataKey="valor" radius={[10, 10, 10, 10]}>
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={index === 1 ? "#7C3AED" : "#E4D9FF"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-brand-50/60 p-3">
            <p className="text-xs text-[var(--text-tertiary)]">{previousLabel}</p>
            <p className="mt-1 font-display text-sm font-bold text-[var(--text-primary)]">{formatCurrency(previous)}</p>
          </div>
          <div className="rounded-xl bg-brand-100/70 p-3">
            <p className="text-xs text-brand-700">{currentLabel}</p>
            <p className="mt-1 font-display text-sm font-bold text-brand-800">{formatCurrency(current)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
