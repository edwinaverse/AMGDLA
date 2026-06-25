"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Course } from "@/lib/types";
import { newId } from "@/lib/id";

export function CoursesList({ courses, onChange }: { courses: Course[]; onChange: (courses: Course[]) => void }) {
  const [form, setForm] = useState({ name: "", credits: "3", grade: "" });

  function addCourse() {
    if (!form.name.trim()) return;
    onChange([
      ...courses,
      { id: newId(), name: form.name.trim(), credits: Number(form.credits) || 3, grade: form.grade.trim() },
    ]);
    setForm({ name: "", credits: "3", grade: "" });
  }

  function updateCourse(id: string, patch: Partial<Course>) {
    onChange(courses.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <Card>
      <SectionHeader subtitle="Active courses this term">Current courses</SectionHeader>
      <div className="space-y-2">
        {courses.map((c) => (
          <div key={c.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <input
              className="input-field flex-1 bg-transparent py-1"
              value={c.name}
              onChange={(e) => updateCourse(c.id, { name: e.target.value })}
            />
            <input
              type="number"
              className="input-field w-16 bg-transparent py-1 text-center"
              value={c.credits}
              onChange={(e) => updateCourse(c.id, { credits: Number(e.target.value) || 0 })}
            />
            <input
              className="input-field w-20 bg-transparent py-1 text-center"
              placeholder="Grade"
              value={c.grade}
              onChange={(e) => updateCourse(c.id, { grade: e.target.value })}
            />
            <button
              aria-label="Remove course"
              className="text-ink-faint opacity-0 transition-opacity hover:text-pink group-hover:opacity-100"
              onClick={() => onChange(courses.filter((x) => x.id !== c.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {courses.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No active courses yet.</p>}
      </div>
      <form
        className="mt-3 flex gap-2"
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
          className="input-field w-20 text-center"
          placeholder="Grade"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
