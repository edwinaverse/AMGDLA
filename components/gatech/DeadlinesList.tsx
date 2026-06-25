"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Course, Deadline, DeadlineType } from "@/lib/types";
import { newId } from "@/lib/id";

const TYPE_TONE: Record<DeadlineType, "pink" | "ice" | "grey"> = {
  assignment: "ice",
  exam: "pink",
  project: "grey",
};

export function DeadlinesList({
  deadlines,
  courses,
  onChange,
}: {
  deadlines: Deadline[];
  courses: Course[];
  onChange: (deadlines: Deadline[]) => void;
}) {
  const [form, setForm] = useState({ title: "", courseId: courses[0]?.id ?? "", dueDate: "", type: "assignment" as DeadlineType });

  const sorted = [...deadlines].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const courseName = (id: string) => courses.find((c) => c.id === id)?.name ?? "—";

  function addDeadline() {
    if (!form.title.trim() || !form.dueDate) return;
    onChange([
      ...deadlines,
      { id: newId(), title: form.title.trim(), courseId: form.courseId, dueDate: form.dueDate, type: form.type, done: false },
    ]);
    setForm({ ...form, title: "", dueDate: "" });
  }

  return (
    <Card>
      <SectionHeader subtitle="Sorted by soonest due">Assignment & exam deadlines</SectionHeader>
      <div className="space-y-2">
        {sorted.map((d) => (
          <div key={d.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <input
              type="checkbox"
              className="dash-checkbox"
              checked={d.done}
              onChange={() => onChange(deadlines.map((x) => (x.id === d.id ? { ...x, done: !x.done } : x)))}
            />
            <div className="flex-1">
              <p className={`text-sm ${d.done ? "text-ink-faint line-through" : "text-ink"}`}>{d.title}</p>
              <p className="text-xs text-ink-faint">
                {courseName(d.courseId)} · {d.dueDate}
              </p>
            </div>
            <Badge tone={TYPE_TONE[d.type]}>{d.type}</Badge>
            <button
              aria-label="Remove deadline"
              className="text-ink-faint opacity-0 transition-opacity hover:text-pink group-hover:opacity-100"
              onClick={() => onChange(deadlines.filter((x) => x.id !== d.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {sorted.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No deadlines logged.</p>}
      </div>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addDeadline();
        }}
      >
        <input
          className="input-field flex-1"
          placeholder="Deadline title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="input-field w-auto"
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
        >
          <option value="">No course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input-field w-auto"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as DeadlineType })}
        >
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
          <option value="project">Project</option>
        </select>
        <input
          type="date"
          className="input-field w-auto"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
