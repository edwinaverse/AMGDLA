"use client";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

export function ConsistencyScore({
  sessions,
  goal,
  onSessionsChange,
  onGoalChange,
}: {
  sessions: number;
  goal: number;
  onSessionsChange: (n: number) => void;
  onGoalChange: (n: number) => void;
}) {
  const percent = goal > 0 ? (sessions / goal) * 100 : 0;
  const met = sessions >= goal;

  return (
    <Card>
      <SectionHeader subtitle="Sessions completed this week">Weekly consistency</SectionHeader>
      <div className="mb-4 flex items-end gap-3">
        <span className="font-serif text-4xl text-ink">{sessions}</span>
        <span className="pb-1 text-ink-dim">
          / {goal} session{goal === 1 ? "" : "s"} {met && <span className="text-pink">✓ goal met</span>}
        </span>
      </div>
      <ProgressBar percent={percent} />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => onSessionsChange(Math.max(0, sessions - 1))}>−</Button>
          <Button variant="primary" onClick={() => onSessionsChange(sessions + 1)}>
            Log a session
          </Button>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-dim">
          Goal
          <input
            type="number"
            min={1}
            className="input-field w-16 text-center"
            value={goal}
            onChange={(e) => onGoalChange(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
      </div>
    </Card>
  );
}
