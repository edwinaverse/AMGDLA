"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { CoursesList } from "@/components/gatech/CoursesList";
import { DeadlinesList } from "@/components/gatech/DeadlinesList";
import { StudyLog } from "@/components/gatech/StudyLog";
import { DegreeProgress } from "@/components/gatech/DegreeProgress";

export default function GatechPage() {
  const { data, update, loading } = useDashboard();

  if (loading) return <p className="text-ink-dim">Loading…</p>;

  const { gatech } = data;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-ink">Georgia Tech</h1>
      <CoursesList
        courses={gatech.courses}
        onChange={(courses) => update((draft) => ({ ...draft, gatech: { ...draft.gatech, courses } }))}
      />
      <DeadlinesList
        deadlines={gatech.deadlines}
        courses={gatech.courses}
        onChange={(deadlines) => update((draft) => ({ ...draft, gatech: { ...draft.gatech, deadlines } }))}
      />
      <StudyLog
        sessions={gatech.studyLog}
        courses={gatech.courses}
        onChange={(studyLog) => update((draft) => ({ ...draft, gatech: { ...draft.gatech, studyLog } }))}
      />
      <DegreeProgress
        courses={gatech.degree.courses}
        onChange={(courses) =>
          update((draft) => ({ ...draft, gatech: { ...draft.gatech, degree: { courses } } }))
        }
      />
    </div>
  );
}
