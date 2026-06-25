"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Task } from "@/lib/types";
import { newId } from "@/lib/id";
import { useConfetti } from "./useConfetti";
import { usePopSound } from "./usePopSound";

export function TaskList({ tasks, onChange }: { tasks: Task[]; onChange: (tasks: Task[]) => void }) {
  const [newTask, setNewTask] = useState("");
  const fireConfetti = useConfetti();
  const playPop = usePopSound();
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function addTask() {
    if (!newTask.trim()) return;
    onChange([...tasks, { id: newId(), text: newTask.trim(), done: false }]);
    setNewTask("");
  }

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    onChange(next);
    if (task && !task.done) {
      fireConfetti(rowRefs.current[id]);
      playPop();
    }
  }

  function deleteTask(id: string) {
    onChange(tasks.filter((t) => t.id !== id));
  }

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <Card>
      <SectionHeader subtitle={`${remaining} of ${tasks.length} remaining`}>Tasks</SectionHeader>
      <div className="space-y-1.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            ref={(el) => {
              rowRefs.current[task.id] = el;
            }}
            className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03]"
          >
            <input
              type="checkbox"
              className="dash-checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />
            <span className={`flex-1 text-sm ${task.done ? "text-ink-faint line-through" : "text-ink"}`}>
              {task.text}
            </span>
            <button
              aria-label="Delete task"
              className="text-ink-faint opacity-0 transition-opacity hover:text-pink group-hover:opacity-100"
              onClick={() => deleteTask(task.id)}
            >
              ✕
            </button>
          </div>
        ))}
        {tasks.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No tasks yet — add one below.</p>}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          className="input-field"
          placeholder="Add a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
