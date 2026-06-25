import { DashboardData, Goal } from "./types";
import { currentWeekKey, currentQuarterKey, isWithinNextNDays, daysUntil, weekRangeLabel } from "./weekUtils";

export interface BriefingDeadline {
  label: string;
  dueDate: string;
  daysUntil: number;
}

export interface BriefingPayload {
  weekRangeLabel: string;
  openTasks: { id: string; text: string }[];
  gtDeadlines: BriefingDeadline[];
  contentDeadlines: BriefingDeadline[];
  quarterKey: string;
  motivationalTieIn: string;
  text: string;
}

function daysUntilLabel(n: number): string {
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  return `in ${n} days`;
}

export function buildBriefing(data: DashboardData): BriefingPayload {
  const weekKey = currentWeekKey();
  const week = data.weeks[weekKey];
  const openTasks = (week?.tasks ?? []).filter((t) => !t.done).map((t) => ({ id: t.id, text: t.text }));

  const courseNameById = new Map(data.gatech.courses.map((c) => [c.id, c.name]));
  const gtDeadlines: BriefingDeadline[] = data.gatech.deadlines
    .filter((d) => !d.done && isWithinNextNDays(d.dueDate, 3))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((d) => ({
      label: `${d.title}${courseNameById.has(d.courseId) ? ` (${courseNameById.get(d.courseId)})` : ""} — ${d.type}`,
      dueDate: d.dueDate,
      daysUntil: daysUntil(d.dueDate),
    }));

  const contentDeadlines: BriefingDeadline[] = [
    ...data.content.calendar
      .filter((c) => c.status !== "posted" && isWithinNextNDays(c.plannedDate, 3))
      .map((c) => ({ label: `${c.title} (${c.platform} ${c.type})`, dueDate: c.plannedDate, daysUntil: daysUntil(c.plannedDate) })),
    ...data.content.brandDeals
      .filter((b) => b.status !== "paid" && isWithinNextNDays(b.deadline, 3))
      .map((b) => ({ label: `${b.brand}: ${b.deliverable}`, dueDate: b.deadline, daysUntil: daysUntil(b.deadline) })),
  ].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const quarterKey = currentQuarterKey();
  const quarterGoals = data.quarterlyGoals.quarters[quarterKey];
  const motivationalTieIn = buildMotivationalTieIn(quarterGoals);

  const text = formatBriefingText({
    weekRangeLabel: weekRangeLabel(weekKey),
    openTasks,
    gtDeadlines,
    contentDeadlines,
    motivationalTieIn,
  });

  return {
    weekRangeLabel: weekRangeLabel(weekKey),
    openTasks,
    gtDeadlines,
    contentDeadlines,
    quarterKey,
    motivationalTieIn,
    text,
  };
}

function buildMotivationalTieIn(quarterGoals: DashboardData["quarterlyGoals"]["quarters"][string] | undefined): string {
  if (!quarterGoals) {
    return "Every task today is a small deposit toward the bigger picture you're building this quarter — keep stacking them up. 🌱";
  }
  const incomplete = (Object.entries(quarterGoals) as [string, Goal[]][]).flatMap(([category, goals]) =>
    goals.filter((g) => !g.completed).map((g) => ({ category, text: g.text }))
  );
  if (incomplete.length === 0) {
    return "You've cleared your quarterly goals — today is about maintaining that momentum and staying intentional with your time. ✨";
  }
  const sample = incomplete.slice(0, 2);
  const categories = Array.from(new Set(sample.map((g) => g.category)));
  return `Remember, this all ladders up to your ${categories.join(" and ")} goals this quarter — especially "${sample[0].text}". Small, steady progress today is what makes the bigger picture feel inevitable rather than far away. 💪`;
}

function formatBriefingText(input: {
  weekRangeLabel: string;
  openTasks: { id: string; text: string }[];
  gtDeadlines: BriefingDeadline[];
  contentDeadlines: BriefingDeadline[];
  motivationalTieIn: string;
}): string {
  const lines: string[] = [];
  lines.push(`Good morning! ☀️ Here's your briefing for the week of ${input.weekRangeLabel}.`);
  lines.push("");

  lines.push("✅ *Today's open tasks:*");
  if (input.openTasks.length === 0) {
    lines.push("   Nothing on the list right now — a clear runway. 🌤️");
  } else {
    input.openTasks.forEach((t) => lines.push(`   • ${t.text}`));
  }
  lines.push("");

  if (input.gtDeadlines.length > 0) {
    lines.push("🎓 *Georgia Tech — due soon:*");
    input.gtDeadlines.forEach((d) => lines.push(`   • ${d.label} — ${daysUntilLabel(d.daysUntil)}`));
    lines.push("");
  }

  if (input.contentDeadlines.length > 0) {
    lines.push("🎬 *Content & brand deals — due soon:*");
    input.contentDeadlines.forEach((d) => lines.push(`   • ${d.label} — ${daysUntilLabel(d.daysUntil)}`));
    lines.push("");
  }

  lines.push(`💭 ${input.motivationalTieIn}`);

  return lines.join("\n");
}
