"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { WeekFocus } from "@/lib/types";

export function FocusCard({
  focus,
  onChange,
}: {
  focus: WeekFocus;
  onChange: (focus: WeekFocus) => void;
}) {
  const [newSubGoal, setNewSubGoal] = useState("");

  return (
    <Card>
      <SectionHeader subtitle="The one thing that matters most this week">This week&apos;s focus</SectionHeader>
      <input
        className="input-field mb-4 text-base font-medium"
        placeholder="e.g. Ship the NLP project milestone"
        value={focus.title}
        onChange={(e) => onChange({ ...focus, title: e.target.value })}
      />
      <div className="space-y-2">
        {focus.subGoals.map((goal, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-ice">›</span>
            <input
              className="input-field flex-1 bg-transparent py-1"
              value={goal}
              onChange={(e) => {
                const next = [...focus.subGoals];
                next[i] = e.target.value;
                onChange({ ...focus, subGoals: next });
              }}
            />
            <button
              aria-label="Remove sub-goal"
              className="text-ink-faint transition-colors hover:text-sage"
              onClick={() => onChange({ ...focus, subGoals: focus.subGoals.filter((_, idx) => idx !== i) })}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newSubGoal.trim()) return;
          onChange({ ...focus, subGoals: [...focus.subGoals, newSubGoal.trim()] });
          setNewSubGoal("");
        }}
      >
        <input
          className="input-field"
          placeholder="Add a sub-goal"
          value={newSubGoal}
          onChange={(e) => setNewSubGoal(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
    </Card>
  );
}
