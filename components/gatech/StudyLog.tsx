"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Course, StudySession } from "@/lib/types";
import { newId } from "@/lib/id";
import { todayIso } from "@/lib/weekUtils";

export function StudyLog({
  sessions,
  courses,
  onChange,
}: {
  sessions: StudySession[];
  courses: Course[];
  onChange: (sessions: StudySession[]) => void;
}) {
  const [form, setForm] = useState({ date: todayIso(), durationMinutes: "60", courseId: courses[0]?.id ?? "" });
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  const courseName = (id: string) => courses.find((c) => c.id === id)?.name ?? "—";
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  function addSession() {
    if (!form.date) return;
    onChange([
      ...sessions,
      { id: newId(), date: form.date, durationMinutes: Number(form.durationMinutes) || 0, courseId: form.courseId },
    ]);
  }

  return (
    <Card>
      <SectionHeader subtitle={`${Math.round((totalMinutes / 60) * 10) / 10} hours logged total`}>
        Study session log
      </SectionHeader>
      <div className="max-h-56 space-y-2 overflow-y-auto">
        {sorted.map((s) => (
          <div key={s.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <span className="text-sm text-ink-dim">{s.date}</span>
            <span className="flex-1 text-sm text-ink">{courseName(s.courseId)}</span>
            <span className="text-xs text-ink-faint">{s.durationMinutes} min</span>
            <button
              aria-label="Remove session"
              className="text-ink-faint opacity-0 transition-opacity hover:text-sage group-hover:opacity-100"
              onClick={() => onChange(sessions.filter((x) => x.id !== s.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {sorted.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No study sessions logged yet.</p>}
      </div>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addSession();
        }}
      >
        <input
          type="date"
          className="input-field w-auto"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <select
          className="input-field w-auto flex-1"
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
        <input
          type="number"
          className="input-field w-24"
          placeholder="Minutes"
          value={form.durationMinutes}
          onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
        />
        <Button type="submit" variant="primary">
          Log
        </Button>
      </form>
    </Card>
  );
}
