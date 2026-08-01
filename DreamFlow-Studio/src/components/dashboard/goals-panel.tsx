import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNumber } from "@/lib/format";

type Goal = {
  id: string;
  title: string;
  description: string | null;
  target: number;
  current: number;
  period: string;
};

export function GoalsPanel({ goals }: { goals: Goal[] }) {
  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Metas do mês</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {goals.length === 0 ? (
          <EmptyState icon={Target} title="Nenhuma meta cadastrada" description="Defina metas para acompanhar o progresso da agência." />
        ) : (
          goals.map((goal) => {
            const percent = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
            return (
              <div key={goal.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{goal.title}</p>
                  <p className="text-xs font-semibold text-brand-600">{percent}%</p>
                </div>
                {goal.description ? (
                  <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{goal.description}</p>
                ) : null}
                <ProgressBar value={percent} className="mt-2.5" />
                <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)]">
                  {formatNumber(goal.current)} de {formatNumber(goal.target)} · {goal.period}
                </p>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
