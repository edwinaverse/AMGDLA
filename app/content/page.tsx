"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { ContentCalendar } from "@/components/content/ContentCalendar";
import { IdeasPipeline } from "@/components/content/IdeasPipeline";
import { BrandDeals } from "@/components/content/BrandDeals";
import { ContentGoals } from "@/components/content/ContentGoals";
import { ConsistencyTracker } from "@/components/content/ConsistencyTracker";
import { ContentPlatform } from "@/lib/types";

export default function ContentPage() {
  const { data, update, loading } = useDashboard();

  if (loading) return <p className="text-ink-dim">Loading…</p>;

  const { content } = data;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-ink">Content creation</h1>

      <ConsistencyTracker
        consistency={content.consistency}
        onChange={(platform: ContentPlatform, platformData) =>
          update((draft) => ({
            ...draft,
            content: { ...draft.content, consistency: { ...draft.content.consistency, [platform]: platformData } },
          }))
        }
      />

      <ContentCalendar
        items={content.calendar}
        onChange={(calendar) => update((draft) => ({ ...draft, content: { ...draft.content, calendar } }))}
      />

      <IdeasPipeline
        ideas={content.ideas}
        onChange={(ideas) => update((draft) => ({ ...draft, content: { ...draft.content, ideas } }))}
      />

      <BrandDeals
        deals={content.brandDeals}
        onChange={(brandDeals) => update((draft) => ({ ...draft, content: { ...draft.content, brandDeals } }))}
      />

      <ContentGoals
        goalsByQuarter={content.goals}
        onChange={(quarterKey, goals) =>
          update((draft) => ({
            ...draft,
            content: { ...draft.content, goals: { ...draft.content.goals, [quarterKey]: goals } },
          }))
        }
      />
    </div>
  );
}
