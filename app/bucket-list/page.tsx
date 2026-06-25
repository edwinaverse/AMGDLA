"use client";

import { useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { CategoryFilter } from "@/components/bucketlist/CategoryFilter";
import { BucketListItemRow } from "@/components/bucketlist/BucketListItemRow";
import { BUCKET_CATEGORIES } from "@/components/bucketlist/categoryColors";
import { BucketCategory } from "@/lib/types";
import { newId } from "@/lib/id";
import { todayIso } from "@/lib/weekUtils";

export default function BucketListPage() {
  const { data, update, loading } = useDashboard();
  const [filter, setFilter] = useState<BucketCategory | "All">("All");
  const [form, setForm] = useState({ title: "", category: BUCKET_CATEGORIES[0] as BucketCategory });

  if (loading) return <p className="text-ink-dim">Loading…</p>;

  const items = data.bucketList.items;
  const completedCount = items.filter((i) => i.completed).length;
  const percent = items.length > 0 ? (completedCount / items.length) * 100 : 0;
  const visibleItems = filter === "All" ? items : items.filter((i) => i.category === filter);

  function setItems(next: typeof items) {
    update((draft) => ({ ...draft, bucketList: { items: next } }));
  }

  function toggle(id: string) {
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, completed: !i.completed, completedDate: !i.completed ? todayIso() : null } : i
      )
    );
  }

  function addItem() {
    if (!form.title.trim()) return;
    setItems([
      ...items,
      { id: newId(), title: form.title.trim(), category: form.category, completed: false, completedDate: null },
    ]);
    setForm({ ...form, title: "" });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-ink">Bucket list</h1>

      <Card>
        <SectionHeader subtitle={`${completedCount} of ${items.length} completed`}>Overall progress</SectionHeader>
        <ProgressBar percent={percent} />
      </Card>

      <Card>
        <SectionHeader>Items</SectionHeader>
        <div className="mb-4">
          <CategoryFilter active={filter} onChange={setFilter} />
        </div>
        <div className="space-y-1.5">
          {visibleItems.map((item) => (
            <BucketListItemRow
              key={item.id}
              item={item}
              onToggle={() => toggle(item.id)}
              onDelete={() => setItems(items.filter((i) => i.id !== item.id))}
            />
          ))}
          {visibleItems.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">Nothing here yet.</p>}
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
            placeholder="Add a bucket list item"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            className="input-field w-auto"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as BucketCategory })}
          >
            {BUCKET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </form>
      </Card>
    </div>
  );
}
