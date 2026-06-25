export type Id = string;

export interface Task {
  id: Id;
  text: string;
  done: boolean;
}

export interface WeekFocus {
  title: string;
  subGoals: string[];
}

export interface WeekEntry {
  focus: WeekFocus;
  tasks: Task[];
}

export interface GymData {
  weeklyGoal: number;
  weeks: Record<string, { sessions: number }>;
}

export type CourseGrade = string;

export interface Course {
  id: Id;
  name: string;
  credits: number;
  grade: CourseGrade;
}

export type DeadlineType = "assignment" | "exam" | "project";

export interface Deadline {
  id: Id;
  courseId: Id;
  title: string;
  dueDate: string; // ISO date
  type: DeadlineType;
  done: boolean;
}

export interface StudySession {
  id: Id;
  date: string; // ISO date
  durationMinutes: number;
  courseId: Id;
}

export interface DegreeCourse {
  id: Id;
  name: string;
  credits: number;
  category: string;
  completed: boolean;
}

export interface GatechData {
  courses: Course[];
  deadlines: Deadline[];
  studyLog: StudySession[];
  degree: {
    courses: DegreeCourse[];
  };
}

export type GoalCategoryName = "Finance" | "Health" | "Career" | "Personal" | "Content Creation";

export interface Goal {
  id: Id;
  text: string;
  completed: boolean;
}

export interface QuarterGoals {
  Finance: Goal[];
  Health: Goal[];
  Career: Goal[];
  Personal: Goal[];
  "Content Creation": Goal[];
}

export interface ParkingLotItem {
  id: Id;
  text: string;
}

export interface QuarterlyGoalsData {
  quarters: Record<string, QuarterGoals>;
  parkingLot: ParkingLotItem[];
}

export type BucketCategory =
  | "Travel"
  | "Career"
  | "Experience"
  | "Personal"
  | "Health"
  | "Creative"
  | "Financial";

export interface BucketListItem {
  id: Id;
  title: string;
  category: BucketCategory;
  completed: boolean;
  completedDate: string | null;
}

export interface BucketListData {
  items: BucketListItem[];
}

export type ContentPlatform = "TikTok" | "Instagram" | "YouTube";
export type ContentType = "video" | "reel" | "photo" | "vlog";
export type ContentStatus =
  | "idea"
  | "in progress"
  | "filmed"
  | "editing"
  | "scheduled"
  | "posted";

export interface CalendarItem {
  id: Id;
  title: string;
  platform: ContentPlatform;
  type: ContentType;
  plannedDate: string; // ISO date
  status: ContentStatus;
}

export type Priority = "low" | "medium" | "high";

export interface ContentIdea {
  id: Id;
  platform: ContentPlatform;
  description: string;
  priority: Priority;
}

export type BrandDealStatus = "negotiating" | "confirmed" | "delivered" | "paid";

export interface BrandDeal {
  id: Id;
  brand: string;
  deliverable: string;
  deadline: string; // ISO date
  payment: number;
  status: BrandDealStatus;
}

export interface ContentQuarterGoal {
  id: Id;
  platform: ContentPlatform;
  goalText: string;
  notes: string;
}

export interface PlatformConsistency {
  goalPerWeek: number;
  weeks: Record<string, number>;
}

export interface ContentData {
  calendar: CalendarItem[];
  ideas: ContentIdea[];
  brandDeals: BrandDeal[];
  goals: Record<string, ContentQuarterGoal[]>;
  consistency: Record<ContentPlatform, PlatformConsistency>;
}

export interface DashboardData {
  weeks: Record<string, WeekEntry>;
  gym: GymData;
  gatech: GatechData;
  quarterlyGoals: QuarterlyGoalsData;
  bucketList: BucketListData;
  content: ContentData;
}
