"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ParkingLotItem } from "@/lib/types";
import { newId } from "@/lib/id";

export function ParkingLot({
  items,
  onChange,
}: {
  items: ParkingLotItem[];
  onChange: (items: ParkingLotItem[]) => void;
}) {
  const [newItem, setNewItem] = useState("");

  function addItem() {
    if (!newItem.trim()) return;
    onChange([...items, { id: newId(), text: newItem.trim() }]);
    setNewItem("");
  }

  return (
    <Card>
      <SectionHeader subtitle="Ideas worth revisiting later — not tied to any quarter">Parking lot</SectionHeader>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <span className="text-grey">·</span>
            <span className="flex-1 text-sm text-ink">{item.text}</span>
            <button
              aria-label="Remove idea"
              className="text-ink-faint opacity-0 transition-opacity hover:text-pink group-hover:opacity-100"
              onClick={() => onChange(items.filter((x) => x.id !== item.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="py-3 text-center text-sm text-ink-faint">Nothing parked right now.</p>}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addItem();
        }}
      >
        <input
          className="input-field"
          placeholder="Park an idea for later"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
