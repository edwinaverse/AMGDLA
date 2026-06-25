import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function WeekSummaryCard({ summary }: { summary: string }) {
  return (
    <Card>
      <SectionHeader subtitle="A fresh read on how the week is going, generated daily">This week, so far</SectionHeader>
      <p className="text-sm leading-relaxed text-ink-dim">{summary}</p>
    </Card>
  );
}
