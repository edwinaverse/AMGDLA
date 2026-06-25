"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { GoalCategoryName, Task } from "@/lib/types";
import { newId } from "@/lib/id";
import { todayIso } from "@/lib/weekUtils";
import { GOAL_CATEGORIES, goalCategoryBadgeStyle, goalHashtag } from "@/lib/goalCategories";
import { useConfetti } from "./useConfetti";
import { usePopSound } from "./usePopSound";

const STAR_COLOR = "#f0c98a";

export function TaskList({ tasks, onChange }: { tasks: Task[]; onChange: (tasks: Task[]) => void }) {
  const [newTask, setNewTask] = useState("");
  const [subtaskDrafts, setSubtaskDrafts] = useState<Record<string, string>>({});
  const fireConfetti = useConfetti();
  const playPop = usePopSound();
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function addTask() {
    if (!newTask.trim()) return;
    onChange([
      ...tasks,
      { id: newId(), text: newTask.trim(), done: false, starred: false, subtasks: [], goalCategory: null, completedAt: null },
    ]);
    setNewTask("");
  }

  function updateTask(id: string, patch: Partial<Task>) {
    onChange(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextDone = !task.done;
    const today = todayIso();
    updateTask(id, {
      done: nextDone,
      completedAt: nextDone ? today : null,
      // Completing a task auto-completes any subtasks still open.
      subtasks: nextDone
        ? task.subtasks.map((s) => (s.done ? s : { ...s, done: true, completedAt: today }))
        : task.subtasks,
    });
    if (nextDone) {
      fireConfetti(rowRefs.current[id]);
      playPop();
    }
  }

  function deleteTask(id: string) {
    onChange(tasks.filter((t) => t.id !== id));
  }

  function addSubtask(taskId: string) {
    const text = (subtaskDrafts[taskId] ?? "").trim();
    if (!text) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { subtasks: [...task.subtasks, { id: newId(), text, done: false, completedAt: null }] });
    setSubtaskDrafts((prev) => ({ ...prev, [taskId]: "" }));
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    updateTask(taskId, {
      subtasks: task.subtasks.map((s) => {
        if (s.id !== subtaskId) return s;
        const nextDone = !s.done;
        return { ...s, done: nextDone, completedAt: nextDone ? todayIso() : null };
      }),
    });
  }

  function deleteSubtask(taskId: string, subtaskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { subtasks: task.subtasks.filter((s) => s.id !== subtaskId) });
  }

  const remaining = tasks.filter((t) => !t.done).length;
  const sortedTasks = [...tasks].sort((a, b) => Number(b.starred) - Number(a.starred));

  return (
    <Card>
      <SectionHeader subtitle={`${remaining} of ${tasks.length} remaining`}>Tasks</SectionHeader>
      <div className="space-y-1.5">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            ref={(el) => {
              rowRefs.current[task.id] = el;
            }}
            className={`group rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03] ${
              task.starred ? "border-l-2 bg-white/[0.02]" : ""
            }`}
            style={task.starred ? { borderColor: `${STAR_COLOR}99` } : undefined}
          >
            <div className="flex items-center gap-2">
              <button
                aria-label={task.starred ? "Unstar task" : "Star task"}
                className={`text-sm transition-opacity ${
                  task.starred ? "opacity-100" : "text-ink-faint opacity-0 group-hover:opacity-100"
                }`}
                style={task.starred ? { color: STAR_COLOR } : undefined}
                onClick={() => updateTask(task.id, { starred: !task.starred })}
              >
                {task.starred ? "★" : "☆"}
              </button>
              <input
                type="checkbox"
                className="dash-checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span className={`flex-1 text-sm ${task.done ? "text-ink-faint line-through" : "text-ink"}`}>
                {task.text}
              </span>
              <select
                aria-label="Tag with a goal"
                className="rounded-full border bg-transparent px-2 py-0.5 text-[10px] font-medium outline-none transition"
                style={goalCategoryBadgeStyle(task.goalCategory)}
                value={task.goalCategory ?? ""}
                onChange={(e) =>
                  updateTask(task.id, { goalCategory: (e.target.value || null) as GoalCategoryName | null })
                }
              >
                <option value="">+ tag</option>
                {GOAL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {goalHashtag(category)}
                  </option>
                ))}
              </select>
              <button
                aria-label="Delete task"
                className="text-ink-faint opacity-0 transition-opacity hover:text-sage group-hover:opacity-100"
                onClick={() => deleteTask(task.id)}
              >
                ✕
              </button>
            </div>

            <div className="ml-9 mt-1 space-y-1">
              {task.subtasks.map((sub) => (
                <div key={sub.id} className="group/sub flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="dash-checkbox"
                    checked={sub.done}
                    onChange={() => toggleSubtask(task.id, sub.id)}
                  />
                  <span className={`flex-1 text-xs ${sub.done ? "text-ink-faint line-through" : "text-ink-dim"}`}>
                    {sub.text}
                  </span>
                  <button
                    aria-label="Delete subtask"
                    className="text-ink-faint opacity-0 transition-opacity hover:text-sage group-hover/sub:opacity-100"
                    onClick={() => deleteSubtask(task.id, sub.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <form
                className="flex items-center gap-2 pt-0.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  addSubtask(task.id);
                }}
              >
                <span className="text-xs text-ink-faint">+</span>
                <input
                  className="flex-1 border-none bg-transparent py-0.5 text-xs text-ink placeholder:text-ink-faint outline-none"
                  placeholder="Add a subtask"
                  value={subtaskDrafts[task.id] ?? ""}
                  onChange={(e) => setSubtaskDrafts((prev) => ({ ...prev, [task.id]: e.target.value }))}
                />
              </form>
            </div>
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
