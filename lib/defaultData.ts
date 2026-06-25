import { DashboardData, DegreeCourse, Task, WeekEntry } from "./types";

/**
 * Best-effort starter list for the MS CS (NLP concentration) degree progress view.
 * Georgia Tech's specialization requirements can change between catalog years —
 * verify against your official degree program / advisor before relying on this,
 * then edit freely from the Georgia Tech view (add/remove/toggle credits as needed).
 */
const NLP_CONCENTRATION_COURSES: DegreeCourse[] = [
  { id: "deg-1", name: "CS 7650 – Natural Language Processing", credits: 3, category: "NLP Core", completed: false },
  { id: "deg-2", name: "CS 7641 – Machine Learning", credits: 3, category: "NLP Core", completed: false },
  { id: "deg-3", name: "CS 7643 – Deep Learning", credits: 3, category: "NLP Elective", completed: false },
  { id: "deg-4", name: "CS 8803 – Special Topics: NLP", credits: 3, category: "NLP Elective", completed: false },
  { id: "deg-5", name: "CS 7642 – Reinforcement Learning", credits: 3, category: "Elective", completed: false },
  { id: "deg-6", name: "CS 6476 – Computer Vision", credits: 3, category: "Elective", completed: false },
  { id: "deg-7", name: "CS 6601 – Artificial Intelligence", credits: 3, category: "Core/Breadth", completed: false },
  { id: "deg-8", name: "CS 6515 – Graduate Algorithms", credits: 3, category: "Core/Breadth", completed: false },
  { id: "deg-9", name: "CS 6750 – Human-Computer Interaction", credits: 3, category: "Elective", completed: false },
  { id: "deg-10", name: "CS 6400 – Database Systems Concepts", credits: 3, category: "Core/Breadth", completed: false },
];

export const TOTAL_REQUIRED_CREDITS = 30;

export function createDefaultData(): DashboardData {
  return {
    weeks: {},
    gym: {
      weeklyGoal: 3,
      weeks: {},
    },
    gatech: {
      courses: [],
      deadlines: [],
      studyLog: [],
      degree: {
        courses: NLP_CONCENTRATION_COURSES,
      },
    },
    quarterlyGoals: {
      quarters: {},
      parkingLot: [],
    },
    bucketList: {
      items: [],
    },
    content: {
      calendar: [],
      ideas: [],
      brandDeals: [],
      goals: {},
      consistency: {
        TikTok: { goalPerWeek: 3, weeks: {} },
        Instagram: { goalPerWeek: 2, weeks: {} },
        YouTube: { goalPerWeek: 1, weeks: {} },
      },
    },
  };
}

/** Backfills fields added to Task after some weeks were already saved (starred, subtasks). */
function normalizeTask(task: Partial<Task>): Task {
  return {
    id: task.id ?? "",
    text: task.text ?? "",
    done: task.done ?? false,
    starred: task.starred ?? false,
    subtasks: task.subtasks ?? [],
  };
}

function normalizeWeeks(weeks: Record<string, WeekEntry> | undefined): Record<string, WeekEntry> {
  if (!weeks) return {};
  return Object.fromEntries(
    Object.entries(weeks).map(([weekKey, week]) => [
      weekKey,
      { ...week, tasks: (week.tasks ?? []).map(normalizeTask) },
    ])
  );
}

/** Fills in any keys missing from older saved blobs without overwriting existing data. */
export function withDefaults(data: Partial<DashboardData> | null | undefined): DashboardData {
  const base = createDefaultData();
  if (!data) return base;
  return {
    weeks: normalizeWeeks(data.weeks),
    gym: {
      weeklyGoal: data.gym?.weeklyGoal ?? base.gym.weeklyGoal,
      weeks: data.gym?.weeks ?? base.gym.weeks,
    },
    gatech: {
      courses: data.gatech?.courses ?? base.gatech.courses,
      deadlines: data.gatech?.deadlines ?? base.gatech.deadlines,
      studyLog: data.gatech?.studyLog ?? base.gatech.studyLog,
      degree: {
        courses: data.gatech?.degree?.courses ?? base.gatech.degree.courses,
      },
    },
    quarterlyGoals: {
      quarters: data.quarterlyGoals?.quarters ?? base.quarterlyGoals.quarters,
      parkingLot: data.quarterlyGoals?.parkingLot ?? base.quarterlyGoals.parkingLot,
    },
    bucketList: {
      items: data.bucketList?.items ?? base.bucketList.items,
    },
    content: {
      calendar: data.content?.calendar ?? base.content.calendar,
      ideas: data.content?.ideas ?? base.content.ideas,
      brandDeals: data.content?.brandDeals ?? base.content.brandDeals,
      goals: data.content?.goals ?? base.content.goals,
      consistency: {
        TikTok: data.content?.consistency?.TikTok ?? base.content.consistency.TikTok,
        Instagram: data.content?.consistency?.Instagram ?? base.content.consistency.Instagram,
        YouTube: data.content?.consistency?.YouTube ?? base.content.consistency.YouTube,
      },
    },
  };
}

export const EMPTY_QUARTER_GOALS = {
  Finance: [],
  Health: [],
  Career: [],
  Personal: [],
  "Content Creation": [],
};
