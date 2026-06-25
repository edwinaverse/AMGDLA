"use client";

import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GOAL_CATEGORIES, GOAL_CATEGORY_HEX, goalHashtag } from "@/lib/goalCategories";
import { DailySeriesPoint } from "@/lib/goalProgress";
import { GoalCategoryName } from "@/lib/types";

const WIDTH = 640;
const HEIGHT = 160;
const PAD_LEFT = 28;
const PLOT_WIDTH = WIDTH - PAD_LEFT;

export function GoalProgressChart({ points }: { points: DailySeriesPoint[] }) {
  const hasData = points.length > 1;
  const maxY = Math.max(1, ...points.flatMap((p) => GOAL_CATEGORIES.map((c) => p.counts[c])));
  const xStep = hasData ? PLOT_WIDTH / (points.length - 1) : 0;

  function pathFor(category: GoalCategoryName): string {
    return points
      .map((p, i) => {
        const x = PAD_LEFT + i * xStep;
        const y = HEIGHT - (p.counts[category] / maxY) * HEIGHT;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  const latest = points[points.length - 1]?.counts;

  return (
    <Card>
      <SectionHeader subtitle="Cumulative tasks completed per goal, tracked day by day this quarter">
        Goal progress this quarter
      </SectionHeader>
      {!hasData ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          Not enough data yet — tag a task with a goal hashtag to start tracking.
        </p>
      ) : (
        <>
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-40 w-full overflow-visible">
            {[0, 0.5, 1].map((f) => (
              <line
                key={f}
                x1={PAD_LEFT}
                x2={WIDTH}
                y1={HEIGHT * f}
                y2={HEIGHT * f}
                stroke="white"
                strokeOpacity={0.06}
              />
            ))}
            <text x={0} y={9} fontSize={9} fill="#6c707c">
              {maxY}
            </text>
            <text x={0} y={HEIGHT - 2} fontSize={9} fill="#6c707c">
              0
            </text>
            {GOAL_CATEGORIES.map((category) => (
              <path key={category} d={pathFor(category)} fill="none" stroke={GOAL_CATEGORY_HEX[category]} strokeWidth={2} />
            ))}
          </svg>
          <div className="mt-1 flex justify-between pl-7 text-[10px] text-ink-faint">
            <span>{format(parseISO(points[0].date), "MMM d")}</span>
            <span>{format(parseISO(points[points.length - 1].date), "MMM d")}</span>
          </div>
        </>
      )}
      <div className="mt-3 flex flex-wrap gap-3">
        {GOAL_CATEGORIES.map((category) => (
          <span key={category} className="flex items-center gap-1.5 text-xs text-ink-dim">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOAL_CATEGORY_HEX[category] }} />
            {goalHashtag(category)} · {latest?.[category] ?? 0}
          </span>
        ))}
      </div>
    </Card>
  );
}
