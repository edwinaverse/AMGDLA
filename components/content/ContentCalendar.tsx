"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CalendarItem, ContentPlatform, ContentStatus, ContentType } from "@/lib/types";
import { newId } from "@/lib/id";
import { todayIso } from "@/lib/weekUtils";

const PLATFORMS: ContentPlatform[] = ["TikTok", "Instagram", "YouTube"];
const TYPES: ContentType[] = ["video", "reel", "photo", "vlog"];
const STATUSES: ContentStatus[] = ["idea", "in progress", "filmed", "editing", "scheduled", "posted"];

const STATUS_TONE: Record<ContentStatus, "pink" | "ice" | "grey" | "neutral"> = {
  idea: "neutral",
  "in progress": "grey",
  filmed: "ice",
  editing: "ice",
  scheduled: "pink",
  posted: "pink",
};

export function ContentCalendar({
  items,
  onChange,
}: {
  items: CalendarItem[];
  onChange: (items: CalendarItem[]) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    platform: PLATFORMS[0],
    type: TYPES[0],
    plannedDate: todayIso(),
    status: "idea" as ContentStatus,
  });

  const sorted = [...items].sort((a, b) => a.plannedDate.localeCompare(b.plannedDate));

  function addItem() {
    if (!form.title.trim()) return;
    onChange([...items, { id: newId(), ...form, title: form.title.trim() }]);
    setForm({ ...form, title: "" });
  }

  return (
    <Card>
      <SectionHeader subtitle="Scheduled posts & videos across platforms">Content calendar</SectionHeader>
      <div className="space-y-2">
        {sorted.map((item) => (
          <div key={item.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <div className="flex-1">
              <p className="text-sm text-ink">{item.title}</p>
              <p className="text-xs text-ink-faint">
                {item.platform} · {item.type} · {item.plannedDate}
              </p>
            </div>
            <select
              className="input-field w-auto bg-transparent py-1 text-xs"
              value={item.status}
              onChange={(e) => onChange(items.map((x) => (x.id === item.id ? { ...x, status: e.target.value as ContentStatus } : x)))}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Badge tone={STATUS_TONE[item.status]}>{item.status}</Badge>
            <button
              aria-label="Remove calendar item"
              className="text-ink-faint opacity-0 transition-opacity hover:text-pink group-hover:opacity-100"
              onClick={() => onChange(items.filter((x) => x.id !== item.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {sorted.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">Nothing scheduled yet.</p>}
      </div>

      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addItem();
        }}
      >
        <input
          className="input-field flex-1"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
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
        <select
          className="input-field w-auto"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as ContentType })}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="input-field w-auto"
          value={form.plannedDate}
          onChange={(e) => setForm({ ...form, plannedDate: e.target.value })}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
