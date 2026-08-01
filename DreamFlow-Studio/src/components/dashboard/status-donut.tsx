"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";

const COLORS: Record<string, string> = {
  active: "#7C3AED",
  completed: "#10B981",
  delayed: "#F43F5E",
  paused: "#CBBFF0",
};

export function StatusDonut({
  data,
}: {
  data: { status: string; label: string; value: number }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Status dos projetos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={62}
                outerRadius={86}
                paddingAngle={4}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status] ?? "#9457FF"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [formatNumber(Number(value)), String(name)]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(124,58,237,0.12)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-2xl font-bold text-[var(--text-primary)]">{formatNumber(total)}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Projetos</p>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {data.map((entry) => (
            <div key={entry.status} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: COLORS[entry.status] ?? "#9457FF" }}
              />
              <span className="text-[var(--text-secondary)]">{entry.label}</span>
              <span className="ml-auto font-semibold text-[var(--text-primary)]">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
