import { Plus, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { StatsGrid, buildDashboardStats } from "@/components/dashboard/stats-grid";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatusDonut } from "@/components/dashboard/status-donut";
import { MonthComparison } from "@/components/dashboard/month-comparison";
import { GoalsPanel } from "@/components/dashboard/goals-panel";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { getCalendarEvents, getDashboardOverview } from "@/server/dashboard";
import { formatMonthLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const [overview, calendarEvents] = await Promise.all([
    getDashboardOverview(),
    getCalendarEvents(now),
  ]);

  const stats = buildDashboardStats(overview);

  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const calendarDays = Array.from(calendarEvents.entries()).map(([dateStr, value]) => ({
    day: Number(dateStr.slice(8, 10)),
    ...value,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Painel geral"
        title="Dashboard"
        description="Acompanhe em tempo real a saúde da Dream Arte: faturamento, clientes, projetos e metas."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md">
              <Sparkles size={16} />
              Relatório
            </Button>
            <Button variant="primary" size="md">
              <Plus size={16} />
              Novo projeto
            </Button>
          </div>
        }
      />

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RevenueChart data={overview.monthlyRevenue} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MonthComparison
              currentLabel={formatMonthLabel(now)}
              previousLabel={formatMonthLabel(previousMonthDate)}
              current={overview.receitaMesAtual}
              previous={overview.receitaMesAnterior}
              variacao={overview.variacaoMensal}
            />
            <StatusDonut data={overview.statusBreakdown} />
          </div>
        </div>

        <div className="space-y-6">
          <MiniCalendar events={calendarDays} />
          <GoalsPanel goals={overview.goals} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingDeadlines payments={overview.proximosVencimentos} projectDeadlines={overview.projectDeadlines} />
        <RecentActivity activities={overview.activities} />
      </div>
    </div>
  );
}
