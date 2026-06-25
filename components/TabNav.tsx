"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "./DashboardProvider";

const TABS = [
  { href: "/week", label: "Week" },
  { href: "/gym", label: "Gym" },
  { href: "/gatech", label: "Georgia Tech" },
  { href: "/goals", label: "Quarterly Goals" },
  { href: "/bucket-list", label: "Bucket List" },
  { href: "/content", label: "Content" },
];

export function TabNav() {
  const pathname = usePathname();
  const { saveStatus } = useDashboard();

  return (
    <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <p className="font-serif text-xl text-ink">Life, in view</p>
          <p className="text-xs text-ink-faint">{saveStatusLabel(saveStatus)}</p>
        </div>
        <nav className="flex flex-wrap gap-1">
          {TABS.map((tab) => {
            const active = pathname?.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors duration-150 ${
                  active ? "bg-sage/15 text-sage" : "text-ink-dim hover:bg-white/[0.06] hover:text-ink"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function saveStatusLabel(status: string): string {
  switch (status) {
    case "saving":
      return "Saving…";
    case "saved":
      return "All changes saved";
    case "error":
      return "Couldn't save — retrying";
    default:
      return "";
  }
}
