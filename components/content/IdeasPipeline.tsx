"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ContentIdea, ContentPlatform, Priority } from "@/lib/types";
import { newId } from "@/lib/id";

const PLATFORMS: ContentPlatform[] = ["TikTok", "Instagram", "YouTube"];
const PRIORITIES: Priority[] = ["low", "medium", "high"];
const PRIORITY_TONE: Record<Priority, "grey" | "ice" | "sage"> = { low: "grey", medium: "ice", high: "sage" };
const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function IdeasPipeline({
  ideas,
  onChange,
}: {
  ideas: ContentIdea[];
  onChange: (ideas: ContentIdea[]) => void;
}) {
  const [form, setForm] = useState({ platform: PLATFORMS[0], description: "", priority: "medium" as Priority });

  const sorted = [...ideas].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);

  function addIdea() {
    if (!form.description.trim()) return;
    onChange([...ideas, { id: newId(), ...form, description: form.description.trim() }]);
    setForm({ ...form, description: "" });
  }

  return (
    <Card>
      <SectionHeader subtitle="Backlog of ideas, kept separate from the schedule">Ideas pipeline</SectionHeader>
      <div className="space-y-2">
        {sorted.map((idea) => (
          <div key={idea.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <Badge tone="ice">{idea.platform}</Badge>
            <span className="flex-1 text-sm text-ink">{idea.description}</span>
            <Badge tone={PRIORITY_TONE[idea.priority]}>{idea.priority}</Badge>
            <button
              aria-label="Remove idea"
              className="text-ink-faint opacity-0 transition-opacity hover:text-sage group-hover:opacity-100"
              onClick={() => onChange(ideas.filter((x) => x.id !== idea.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {sorted.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No ideas parked yet.</p>}
      </div>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addIdea();
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
          placeholder="Idea description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="input-field w-auto"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
