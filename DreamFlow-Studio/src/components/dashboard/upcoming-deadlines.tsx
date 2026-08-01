import { CalendarClock, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDayMonth, daysUntil } from "@/lib/format";
import { cn } from "@/lib/utils";

type PaymentDeadline = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
  clientName: string;
};

type ProjectDeadline = {
  id: string;
  name: string;
  dueDate: string;
  status: string;
  clientName: string;
  progress: number;
};

function urgencyTone(days: number) {
  if (days < 0) return "danger" as const;
  if (days <= 3) return "warning" as const;
  return "brand" as const;
}

export function UpcomingDeadlines({
  payments,
  projectDeadlines,
}: {
  payments: PaymentDeadline[];
  projectDeadlines: ProjectDeadline[];
}) {
  const isEmpty = payments.length === 0 && projectDeadlines.length === 0;

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Próximos vencimentos</CardTitle>
        <Badge tone="warning">14 dias</Badge>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState icon={CalendarClock} title="Tudo em dia" description="Nenhum vencimento nos próximos 14 dias." />
        ) : (
          <ul className="space-y-3">
            {projectDeadlines.map((project) => {
              const days = daysUntil(project.dueDate);
              const tone = urgencyTone(days);
              return (
                <li key={project.id} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <CalendarClock size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{project.name}</p>
                    <p className="truncate text-xs text-[var(--text-tertiary)]">{project.clientName}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone={tone}>{days < 0 ? `${Math.abs(days)}d atraso` : days === 0 ? "Hoje" : `${days}d`}</Badge>
                    <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">{formatDayMonth(new Date(project.dueDate))}</p>
                  </div>
                </li>
              );
            })}
            {payments.map((payment) => {
              const days = daysUntil(payment.dueDate);
              const tone = urgencyTone(days);
              return (
                <li key={payment.id} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] p-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      payment.status === "overdue" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600",
                    )}
                  >
                    <Wallet size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{payment.description}</p>
                    <p className="truncate text-xs text-[var(--text-tertiary)]">{payment.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(payment.amount)}</p>
                    <Badge tone={tone} className="mt-1">
                      {days < 0 ? `${Math.abs(days)}d atraso` : days === 0 ? "Hoje" : `${days}d`}
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
