"use client";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ContentPlatform, PlatformConsistency } from "@/lib/types";
import { currentWeekKey } from "@/lib/weekUtils";
import { computeStreak } from "@/lib/streak";

const PLATFORMS: ContentPlatform[] = ["TikTok", "Instagram", "YouTube"];
const STREAK_PLATFORMS: ContentPlatform[] = ["TikTok", "Instagram"];

export function ConsistencyTracker({
  consistency,
  onChange,
}: {
  consistency: Record<ContentPlatform, PlatformConsistency>;
  onChange: (platform: ContentPlatform, data: PlatformConsistency) => void;
}) {
  const weekKey = currentWeekKey();

  return (
    <Card>
      <SectionHeader subtitle="Weekly posting count vs. goal, per platform">Posting consistency</SectionHeader>
      <div className="grid gap-4 sm:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const data = consistency[platform];
          const count = data.weeks[weekKey] ?? 0;
          const percent = data.goalPerWeek > 0 ? (count / data.goalPerWeek) * 100 : 0;
          const streak = STREAK_PLATFORMS.includes(platform) ? computeStreak(data.weeks, data.goalPerWeek) : null;

          return (
            <div key={platform} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-ink">{platform}</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="font-serif text-2xl text-ink">{count}</span>
                <span className="pb-0.5 text-xs text-ink-dim">/ {data.goalPerWeek} this week</span>
              </div>
              <div className="mt-2">
                <ProgressBar percent={percent} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-ink-dim hover:bg-white/[0.06]"
                    onClick={() => onChange(platform, { ...data, weeks: { ...data.weeks, [weekKey]: Math.max(0, count - 1) } })}
                  >
                    −
                  </button>
                  <button
                    className="rounded-md bg-sage/90 px-2 py-0.5 text-xs text-surface hover:bg-sage"
                    onClick={() => onChange(platform, { ...data, weeks: { ...data.weeks, [weekKey]: count + 1 } })}
                  >
                    + Post
                  </button>
                </div>
                <label className="flex items-center gap-1 text-xs text-ink-faint">
                  Goal
                  <input
                    type="number"
                    min={0}
                    className="input-field w-12 py-0.5 text-center text-xs"
                    value={data.goalPerWeek}
                    onChange={(e) => onChange(platform, { ...data, goalPerWeek: Math.max(0, Number(e.target.value) || 0) })}
                  />
                </label>
              </div>
              {streak !== null && (
                <p className="mt-2 text-xs text-ice">
                  🔥 {streak} week{streak === 1 ? "" : "s"} streak
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
