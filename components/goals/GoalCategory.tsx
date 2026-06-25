"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Goal } from "@/lib/types";
import { newId } from "@/lib/id";

export function GoalCategory({
  title,
  goals,
  tasksCompleted,
  onChange,
}: {
  title: string;
  goals: Goal[];
  tasksCompleted: number;
  onChange: (goals: Goal[]) => void;
}) {
  const [newGoal, setNewGoal] = useState("");
  const completed = goals.filter((g) => g.completed).length;

  function addGoal() {
    if (!newGoal.trim()) return;
    onChange([...goals, { id: newId(), text: newGoal.trim(), completed: false }]);
    setNewGoal("");
  }

  return (
    <Card>
      <SectionHeader
        subtitle={`${completed} of ${goals.length} completed · ${tasksCompleted} task${
          tasksCompleted === 1 ? "" : "s"
        } logged this quarter`}
      >
        {title}
      </SectionHeader>
      <div className="space-y-1.5">
        {goals.map((g) => (
          <div key={g.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <input
              type="checkbox"
              className="dash-checkbox"
              checked={g.completed}
              onChange={() => onChange(goals.map((x) => (x.id === g.id ? { ...x, completed: !x.completed } : x)))}
            />
            <span className={`flex-1 text-sm ${g.completed ? "text-ink-faint line-through" : "text-ink"}`}>
              {g.text}
            </span>
            <button
              aria-label="Remove goal"
              className="text-ink-faint opacity-0 transition-opacity hover:text-sage group-hover:opacity-100"
              onClick={() => onChange(goals.filter((x) => x.id !== g.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {goals.length === 0 && <p className="py-3 text-center text-sm text-ink-faint">No goals yet.</p>}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addGoal();
        }}
      >
        <input
          className="input-field"
          placeholder={`Add a ${title.toLowerCase()} goal`}
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
