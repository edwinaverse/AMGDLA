import { GoalCategoryName } from "./types";

export const GOAL_CATEGORIES: GoalCategoryName[] = ["Finance", "Health", "Career", "Personal", "Content Creation"];

export const GOAL_CATEGORY_HEX: Record<GoalCategoryName, string> = {
  Finance: "#8fb4c2",
  Health: "#e3a0a8",
  Career: "#8fbf7f",
  Personal: "#c9cbd3",
  "Content Creation": "#f0c98a",
};

export function goalHashtag(category: GoalCategoryName): string {
  return `#${category.replace(/\s+/g, "")}`;
}

export function goalCategoryBadgeStyle(category: GoalCategoryName | null | undefined): {
  borderColor: string;
  color: string;
  backgroundColor: string;
} {
  if (!category) {
    return { borderColor: "rgba(255,255,255,0.12)", color: "#6c707c", backgroundColor: "transparent" };
  }
  const hex = GOAL_CATEGORY_HEX[category];
  return { borderColor: `${hex}4d`, color: hex, backgroundColor: `${hex}26` };
}
