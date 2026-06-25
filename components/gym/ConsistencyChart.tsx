"use client";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { format, parseISO } from "date-fns";

export function ConsistencyChart({
  weekKeys,
  sessionsByWeek,
  goal,
}: {
  weekKeys: string[];
  sessionsByWeek: Record<string, { sessions: number }>;
  goal: number;
}) {
  const maxValue = Math.max(goal, ...weekKeys.map((k) => sessionsByWeek[k]?.sessions ?? 0), 1);

  return (
    <Card>
      <SectionHeader subtitle="Last 13 weeks at a glance">Consistency history</SectionHeader>
      <div className="flex h-32 items-end gap-1.5">
        {weekKeys.map((key) => {
          const sessions = sessionsByWeek[key]?.sessions ?? 0;
          const met = sessions >= goal;
          const heightPercent = Math.max(4, (sessions / maxValue) * 100);
          return (
            <div key={key} className="group relative flex flex-1 flex-col items-center justify-end gap-1">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  met ? "bg-pink/80" : sessions > 0 ? "bg-ice/60" : "bg-white/[0.06]"
                }`}
                style={{ height: `${heightPercent}%` }}
              />
              <div className="pointer-events-none absolute -top-7 hidden rounded-md bg-surface-raised px-2 py-1 text-xs text-ink shadow-glass group-hover:block">
                {sessions} / {goal}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-ink-faint">
        <span>{format(parseISO(weekKeys[0]), "MMM d")}</span>
        <span>{format(parseISO(weekKeys[weekKeys.length - 1]), "MMM d")}</span>
      </div>
    </Card>
  );
}
