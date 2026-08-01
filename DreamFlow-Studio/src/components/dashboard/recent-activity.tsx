import { Activity as ActivityIcon, CreditCard, FolderPlus, Target, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type ActivityRow = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: Date;
};

const ICONS: Record<string, typeof ActivityIcon> = {
  client_created: UserPlus,
  project_created: FolderPlus,
  project_status_changed: ActivityIcon,
  payment_received: CreditCard,
  payment_overdue: CreditCard,
  goal_updated: Target,
};

const relativeFormatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function relativeTime(date: Date) {
  const diffMs = date.getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (Math.abs(diffHours) < 24) return relativeFormatter.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return relativeFormatter.format(diffDays, "day");
}

export function RecentActivity({ activities }: { activities: ActivityRow[] }) {
  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Atividade recente</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <EmptyState icon={ActivityIcon} title="Sem atividades" description="As movimentações da agência aparecerão aqui." />
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => {
              const Icon = ICONS[activity.type] ?? ActivityIcon;
              return (
                <li key={activity.id} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1 border-b border-[var(--border-subtle)] pb-3.5 last:border-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{activity.title}</p>
                    {activity.description ? (
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{activity.description}</p>
                    ) : null}
                    <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">{relativeTime(activity.createdAt)}</p>
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
