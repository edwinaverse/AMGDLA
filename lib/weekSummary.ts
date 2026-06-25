import { format } from "date-fns";
import { DashboardData, GoalCategoryName } from "./types";
import { goalHashtag } from "./goalCategories";

/** Rule-based recap of the week's progress, weaknesses, and wins. Recomputed from live task data, so it shifts as the day and the task list change. */
export function buildWeekSummary(data: DashboardData, weekKey: string): string {
  const tasks = data.weeks[weekKey]?.tasks ?? [];
  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    return "No tasks logged for this week yet — once you add a few, this space will start tracking your progress, pain points, and wins each day. 🌱";
  }

  const doneTasks = tasks.filter((t) => t.done);
  const openTasks = tasks.filter((t) => !t.done);
  const starredOpen = openTasks.filter((t) => t.starred);
  const completionRate = Math.round((doneTasks.length / totalTasks) * 100);
  const dayName = format(new Date(), "EEEE");

  const categoryCounts = new Map<GoalCategoryName, number>();
  tasks.forEach((t) => {
    if (!t.goalCategory) return;
    const count = (t.done ? 1 : 0) + t.subtasks.filter((s) => s.done).length;
    if (count === 0) return;
    categoryCounts.set(t.goalCategory, (categoryCounts.get(t.goalCategory) ?? 0) + count);
  });
  const topCategory = Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1])[0];

  const sentences: string[] = [
    `By ${dayName}, you've completed ${doneTasks.length} of ${totalTasks} task${
      totalTasks === 1 ? "" : "s"
    } this week (${completionRate}%).`,
  ];

  if (starredOpen.length > 0) {
    sentences.push(
      `${starredOpen.length === 1 ? "A starred priority is" : `${starredOpen.length} starred priorities are`} still open — that's the spot pulling focus right now.`
    );
  } else if (openTasks.length === 0) {
    sentences.push("Nothing is sitting open right now — the list is fully cleared.");
  } else if (openTasks.length > totalTasks / 2 && totalTasks > 1) {
    sentences.push("More than half the list is still open, so the back half of the week is carrying most of the weight.");
  } else {
    sentences.push(`${openTasks.length} task${openTasks.length === 1 ? "" : "s"} remain open, nothing alarming so far.`);
  }

  if (topCategory) {
    const [category, count] = topCategory;
    sentences.push(
      `The biggest win has been ${goalHashtag(category)} — ${count} task${count === 1 ? "" : "s"} completed there this week.`
    );
  } else if (doneTasks.length > 0) {
    sentences.push("Steady, consistent progress all around — keep that rhythm going.");
  } else {
    sentences.push("Plenty of runway left this week to build some momentum.");
  }

  return sentences.join(" ");
}
