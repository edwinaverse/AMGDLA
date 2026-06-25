"use client";

import { useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { GoalCategory } from "@/components/goals/GoalCategory";
import { ParkingLot } from "@/components/goals/ParkingLot";
import { Button } from "@/components/ui/Button";
import { currentQuarterKey, shiftQuarterKey } from "@/lib/weekUtils";
import { EMPTY_QUARTER_GOALS } from "@/lib/defaultData";
import { GoalCategoryName, QuarterGoals } from "@/lib/types";

const CATEGORIES: GoalCategoryName[] = ["Finance", "Health", "Career", "Personal", "Content Creation"];

export default function GoalsPage() {
  const { data, update, loading } = useDashboard();
  const [quarterKey, setQuarterKey] = useState(currentQuarterKey());

  if (loading) return <p className="text-ink-dim">Loading…</p>;

  const quarter: QuarterGoals = data.quarterlyGoals.quarters[quarterKey] ?? EMPTY_QUARTER_GOALS;
  const isCurrentQuarter = quarterKey === currentQuarterKey();

  function setCategoryGoals(category: GoalCategoryName, goals: QuarterGoals[GoalCategoryName]) {
    update((draft) => ({
      ...draft,
      quarterlyGoals: {
        ...draft.quarterlyGoals,
        quarters: {
          ...draft.quarterlyGoals.quarters,
          [quarterKey]: { ...quarter, [category]: goals },
        },
      },
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Quarterly goals</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setQuarterKey(shiftQuarterKey(quarterKey, -1))}>← Prev</Button>
          <span className="px-2 text-sm text-ink-dim">{quarterKey}</span>
          {!isCurrentQuarter && <Button onClick={() => setQuarterKey(currentQuarterKey())}>This quarter</Button>}
          <Button onClick={() => setQuarterKey(shiftQuarterKey(quarterKey, 1))}>Next →</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {CATEGORIES.map((category) => (
          <GoalCategory
            key={category}
            title={category}
            goals={quarter[category]}
            onChange={(goals) => setCategoryGoals(category, goals)}
          />
        ))}
      </div>

      <ParkingLot
        items={data.quarterlyGoals.parkingLot}
        onChange={(parkingLot) =>
          update((draft) => ({ ...draft, quarterlyGoals: { ...draft.quarterlyGoals, parkingLot } }))
        }
      />
    </div>
  );
}
