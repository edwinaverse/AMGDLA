"use client";

import { useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { FocusCard } from "@/components/week/FocusCard";
import { TaskList } from "@/components/week/TaskList";
import { currentWeekKey, shiftWeekKey, weekRangeLabel } from "@/lib/weekUtils";
import { WeekEntry } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const EMPTY_WEEK: WeekEntry = { focus: { title: "", subGoals: [] }, tasks: [] };

export default function WeekPage() {
  const { data, update, loading } = useDashboard();
  const [weekKey, setWeekKey] = useState(currentWeekKey());

  if (loading) return <p className="text-ink-dim">Loading…</p>;

  const week = data.weeks[weekKey] ?? EMPTY_WEEK;
  const isCurrentWeek = weekKey === currentWeekKey();

  function setWeek(next: WeekEntry) {
    update((draft) => ({ ...draft, weeks: { ...draft.weeks, [weekKey]: next } }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Week view</h1>
          <p className="text-sm text-ink-dim">{weekRangeLabel(weekKey)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setWeekKey(shiftWeekKey(weekKey, -1))}>← Prev</Button>
          {!isCurrentWeek && <Button onClick={() => setWeekKey(currentWeekKey())}>This week</Button>}
          <Button onClick={() => setWeekKey(shiftWeekKey(weekKey, 1))}>Next →</Button>
        </div>
      </div>

      <FocusCard focus={week.focus} onChange={(focus) => setWeek({ ...week, focus })} />
      <TaskList tasks={week.tasks} onChange={(tasks) => setWeek({ ...week, tasks })} />
    </div>
  );
}
