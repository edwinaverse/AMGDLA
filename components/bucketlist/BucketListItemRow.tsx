"use client";

import { BucketListItem } from "@/lib/types";
import { CATEGORY_COLOR_CLASSES } from "./categoryColors";

export function BucketListItemRow({
  item,
  onToggle,
  onDelete,
}: {
  item: BucketListItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
      <input type="checkbox" className="dash-checkbox" checked={item.completed} onChange={onToggle} />
      <div className="flex-1">
        <p className={`text-sm ${item.completed ? "text-ink-faint line-through" : "text-ink"}`}>{item.title}</p>
        {item.completed && item.completedDate && (
          <p className="text-xs text-ink-faint">Completed {item.completedDate}</p>
        )}
      </div>
      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLOR_CLASSES[item.category]}`}>
        {item.category}
      </span>
      <button
        aria-label="Remove item"
        className="text-ink-faint opacity-0 transition-opacity hover:text-pink group-hover:opacity-100"
        onClick={onDelete}
      >
        ✕
      </button>
    </div>
  );
}
