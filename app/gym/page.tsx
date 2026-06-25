"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { ConsistencyScore } from "@/components/gym/ConsistencyScore";
import { ConsistencyChart } from "@/components/gym/ConsistencyChart";
import { currentWeekKey, lastNWeekKeys } from "@/lib/weekUtils";

export default function GymPage() {
  const { data, update, loading } = useDashboard();

  if (loading) return <p className="text-ink-dim">Loading…</p>;

  const weekKey = currentWeekKey();
  const sessions = data.gym.weeks[weekKey]?.sessions ?? 0;
  const goal = data.gym.weeklyGoal;
  const weekKeys = lastNWeekKeys(13, weekKey);

  function setSessions(n: number) {
    update((draft) => ({
      ...draft,
      gym: { ...draft.gym, weeks: { ...draft.gym.weeks, [weekKey]: { sessions: n } } },
    }));
  }

  function setGoal(n: number) {
    update((draft) => ({ ...draft, gym: { ...draft.gym, weeklyGoal: n } }));
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-ink">Gym</h1>
      <ConsistencyScore sessions={sessions} goal={goal} onSessionsChange={setSessions} onGoalChange={setGoal} />
      <ConsistencyChart weekKeys={weekKeys} sessionsByWeek={data.gym.weeks} goal={goal} />
    </div>
  );
}
