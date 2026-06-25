import { currentWeekKey, shiftWeekKey } from "./weekUtils";

/** Counts consecutive weeks (ending the most recently completed week) where weeks[key] >= goal. */
export function computeStreak(weeks: Record<string, number>, goal: number): number {
  if (goal <= 0) return 0;
  let streak = 0;
  let key = shiftWeekKey(currentWeekKey(), -1); // start from last completed week, not the in-progress one
  while ((weeks[key] ?? 0) >= goal) {
    streak += 1;
    key = shiftWeekKey(key, -1);
  }
  return streak;
}
