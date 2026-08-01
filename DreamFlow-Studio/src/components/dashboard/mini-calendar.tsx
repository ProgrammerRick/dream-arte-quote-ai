"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMonthYear } from "@/lib/format";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

type EventDay = { day: number; payments: number; projects: number };

export function MiniCalendar({ events }: { events: EventDay[] }) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { weeks, monthDate, todayKey } = useMemo(() => {
    const base = new Date();
    base.setDate(1);
    base.setMonth(base.getMonth() + monthOffset);

    const firstWeekday = base.getDay();
    const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();

    const cells: (number | null)[] = Array.from({ length: firstWeekday }).map(() => null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === base.getFullYear() && today.getMonth() === base.getMonth();

    return {
      weeks,
      monthDate: base,
      todayKey: isCurrentMonth ? today.getDate() : -1,
    };
  }, [monthOffset]);

  const eventMap = useMemo(() => {
    const map = new Map<number, EventDay>();
    for (const event of events) map.set(event.day, event);
    return map;
  }, [events]);

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Calendário</CardTitle>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMonthOffset((v) => v - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition hover:bg-brand-50 hover:text-brand-700"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => setMonthOffset((v) => v + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition hover:bg-brand-50 hover:text-brand-700"
            aria-label="Próximo mês"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm font-semibold text-[var(--text-primary)]">{formatMonthYear(monthDate)}</p>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[var(--text-tertiary)]">
          {WEEKDAYS.map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {weeks.flatMap((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const event = day ? eventMap.get(day) : undefined;
              const isToday = day === todayKey;
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={cn(
                    "relative flex h-9 flex-col items-center justify-center rounded-lg text-xs",
                    day ? "text-[var(--text-primary)]" : "text-transparent",
                    isToday && "bg-brand-600 font-semibold text-white",
                  )}
                >
                  {day ?? "-"}
                  {event && !isToday ? (
                    <Dot
                      size={16}
                      className={cn(
                        "absolute -bottom-1",
                        event.payments > 0 ? "text-amber-500" : "text-brand-500",
                      )}
                    />
                  ) : null}
                </div>
              );
            }),
          )}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1.5">
            <Dot size={16} className="text-brand-500" /> Prazo de projeto
          </span>
          <span className="flex items-center gap-1.5">
            <Dot size={16} className="text-amber-500" /> Vencimento financeiro
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
