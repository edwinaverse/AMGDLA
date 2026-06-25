import { addDays, format, isAfter, isBefore, parseISO } from "date-fns";
import { DashboardData, GoalCategoryName, Task } from "./types";
import { GOAL_CATEGORIES } from "./goalCategories";
import { quarterDateRange, quarterKeyFor, todayIso } from "./weekUtils";

function tasksInQuarter(data: DashboardData, quarterKey: string): Task[] {
  return Object.entries(data.weeks)
    .filter(([weekKey]) => quarterKeyFor(parseISO(weekKey)) === quarterKey)
    .flatMap(([, week]) => week.tasks);
}

/** Counts completed tasks plus completed subtasks tagged with the given goal category, for the whole quarter. */
export function completedCountForCategory(
  data: DashboardData,
  quarterKey: string,
  category: GoalCategoryName
): number {
  return tasksInQuarter(data, quarterKey)
    .filter((t) => t.goalCategory === category)
    .reduce((sum, t) => sum + (t.done ? 1 : 0) + t.subtasks.filter((s) => s.done).length, 0);
}

export interface DailySeriesPoint {
  date: string;
  counts: Record<GoalCategoryName, number>;
}

/** Cumulative count of completed tasks/subtasks per goal category, one point per day of the quarter (up to today). */
export function dailyCompletionSeries(data: DashboardData, quarterKey: string): DailySeriesPoint[] {
  const { start, end } = quarterDateRange(quarterKey);
  const today = parseISO(todayIso());
  const lastDay = isBefore(today, end) ? today : end;

  const byDate = new Map<string, Partial<Record<GoalCategoryName, number>>>();
  function record(category: GoalCategoryName | null, completedAt: string | null) {
    if (!category || !completedAt) return;
    const bucket = byDate.get(completedAt) ?? {};
    bucket[category] = (bucket[category] ?? 0) + 1;
    byDate.set(completedAt, bucket);
  }
  tasksInQuarter(data, quarterKey).forEach((t) => {
    if (t.done) record(t.goalCategory, t.completedAt);
    t.subtasks.forEach((s) => {
      if (s.done) record(t.goalCategory, s.completedAt);
    });
  });

  const totals: Record<GoalCategoryName, number> = Object.fromEntries(
    GOAL_CATEGORIES.map((c) => [c, 0])
  ) as Record<GoalCategoryName, number>;

  const points: DailySeriesPoint[] = [];
  let cursor = start;
  while (!isAfter(cursor, lastDay)) {
    const dayKey = format(cursor, "yyyy-MM-dd");
    const bucket = byDate.get(dayKey);
    if (bucket) {
      GOAL_CATEGORIES.forEach((c) => {
        totals[c] += bucket[c] ?? 0;
      });
    }
    points.push({ date: dayKey, counts: { ...totals } });
    cursor = addDays(cursor, 1);
  }
  return points;
}
