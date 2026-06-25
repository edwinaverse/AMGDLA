"use client";

import { BucketCategory } from "@/lib/types";
import { BUCKET_CATEGORIES, CATEGORY_COLOR_CLASSES } from "./categoryColors";

export function CategoryFilter({
  active,
  onChange,
}: {
  active: BucketCategory | "All";
  onChange: (category: BucketCategory | "All") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("All")}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          active === "All" ? "border-ink/40 bg-white/[0.08] text-ink" : "border-white/10 text-ink-dim hover:bg-white/[0.06]"
        }`}
      >
        All
      </button>
      {BUCKET_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            active === category ? CATEGORY_COLOR_CLASSES[category] : "border-white/10 text-ink-dim hover:bg-white/[0.06]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
