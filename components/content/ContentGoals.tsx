"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ContentQuarterGoal, ContentPlatform } from "@/lib/types";
import { newId } from "@/lib/id";
import { currentQuarterKey, shiftQuarterKey } from "@/lib/weekUtils";

const PLATFORMS: ContentPlatform[] = ["TikTok", "Instagram", "YouTube"];

export function ContentGoals({
  goalsByQuarter,
  onChange,
}: {
  goalsByQuarter: Record<string, ContentQuarterGoal[]>;
  onChange: (quarterKey: string, goals: ContentQuarterGoal[]) => void;
}) {
  const [quarterKey, setQuarterKey] = useState(currentQuarterKey());
  const [form, setForm] = useState({ platform: PLATFORMS[0], goalText: "", notes: "" });

  const goals = goalsByQuarter[quarterKey] ?? [];
  const isCurrentQuarter = quarterKey === currentQuarterKey();

  function addGoal() {
    if (!form.goalText.trim()) return;
    onChange(quarterKey, [...goals, { id: newId(), ...form, goalText: form.goalText.trim() }]);
    setForm({ ...form, goalText: "", notes: "" });
  }

  return (
    <Card>
      <SectionHeader
        subtitle="Quarterly posting goals per platform"
        action={
          <div className="flex items-center gap-1.5">
            <Button onClick={() => setQuarterKey(shiftQuarterKey(quarterKey, -1))}>←</Button>
            <span className="px-1 text-sm text-ink-dim">{quarterKey}</span>
            {!isCurrentQuarter && <Button onClick={() => setQuarterKey(currentQuarterKey())}>Now</Button>}
            <Button onClick={() => setQuarterKey(shiftQuarterKey(quarterKey, 1))}>→</Button>
          </div>
        }
      >
        Content goals
      </SectionHeader>

      <div className="space-y-2">
        {goals.map((g) => (
          <div key={g.id} className="group flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <Badge tone="ice">{g.platform}</Badge>
            <div className="flex-1">
              <p className="text-sm text-ink">{g.goalText}</p>
              {g.notes && <p className="text-xs text-ink-faint">{g.notes}</p>}
            </div>
            <button
              aria-label="Remove goal"
              className="text-ink-faint opacity-0 transition-opacity hover:text-sage group-hover:opacity-100"
              onClick={() => onChange(quarterKey, goals.filter((x) => x.id !== g.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {goals.length === 0 && <p className="py-3 text-center text-sm text-ink-faint">No goals set for {quarterKey} yet.</p>}
      </div>

      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addGoal();
        }}
      >
        <select
          className="input-field w-auto"
          value={form.platform}
          onChange={(e) => setForm({ ...form, platform: e.target.value as ContentPlatform })}
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          className="input-field flex-1"
          placeholder='e.g. "Post 3x/week on TikTok"'
          value={form.goalText}
          onChange={(e) => setForm({ ...form, goalText: e.target.value })}
        />
        <input
          className="input-field flex-1"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
