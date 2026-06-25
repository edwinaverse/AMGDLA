"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DegreeCourse } from "@/lib/types";
import { newId } from "@/lib/id";
import { TOTAL_REQUIRED_CREDITS } from "@/lib/defaultData";

export function DegreeProgress({
  courses,
  onChange,
}: {
  courses: DegreeCourse[];
  onChange: (courses: DegreeCourse[]) => void;
}) {
  const [form, setForm] = useState({ name: "", credits: "3", category: "Elective" });
  const completedCredits = courses.filter((c) => c.completed).reduce((sum, c) => sum + c.credits, 0);
  const percent = (completedCredits / TOTAL_REQUIRED_CREDITS) * 100;

  function toggle(id: string) {
    onChange(courses.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)));
  }

  function addCourse() {
    if (!form.name.trim()) return;
    onChange([
      ...courses,
      { id: newId(), name: form.name.trim(), credits: Number(form.credits) || 3, category: form.category, completed: false },
    ]);
    setForm({ name: "", credits: "3", category: "Elective" });
  }

  return (
    <Card>
      <SectionHeader subtitle="MS CS — Natural Language Processing concentration">Degree progress</SectionHeader>
      <div className="mb-4 flex items-end gap-3">
        <span className="font-serif text-3xl text-ink">{completedCredits}</span>
        <span className="pb-1 text-ink-dim">/ {TOTAL_REQUIRED_CREDITS} credits completed</span>
      </div>
      <ProgressBar percent={percent} />

      <div className="mt-5 space-y-2">
        {courses.map((c) => (
          <div key={c.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <input type="checkbox" className="dash-checkbox" checked={c.completed} onChange={() => toggle(c.id)} />
            <span className={`flex-1 text-sm ${c.completed ? "text-ink-faint line-through" : "text-ink"}`}>
              {c.name}
            </span>
            <Badge tone="ice">{c.category}</Badge>
            <span className="w-12 text-right text-xs text-ink-faint">{c.credits} cr</span>
            <button
              aria-label="Remove course"
              className="text-ink-faint opacity-0 transition-opacity hover:text-pink group-hover:opacity-100"
              onClick={() => onChange(courses.filter((x) => x.id !== c.id))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addCourse();
        }}
      >
        <input
          className="input-field flex-1"
          placeholder="Course name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          className="input-field w-16 text-center"
          value={form.credits}
          onChange={(e) => setForm({ ...form, credits: e.target.value })}
        />
        <input
          className="input-field w-32"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
