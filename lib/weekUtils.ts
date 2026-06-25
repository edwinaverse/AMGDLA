import { addDays, addWeeks, format, parseISO, startOfWeek, differenceInCalendarDays } from "date-fns";

const WEEK_KEY_FORMAT = "yyyy-MM-dd";

export function weekKeyFor(date: Date): string {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return format(monday, WEEK_KEY_FORMAT);
}

export function currentWeekKey(): string {
  return weekKeyFor(new Date());
}

export function shiftWeekKey(weekKey: string, weeks: number): string {
  const monday = parseISO(weekKey);
  return format(addWeeks(monday, weeks), WEEK_KEY_FORMAT);
}

export function weekRangeLabel(weekKey: string): string {
  const monday = parseISO(weekKey);
  const sunday = addDays(monday, 6);
  return `${format(monday, "MMM d")} – ${format(sunday, "MMM d, yyyy")}`;
}

export function lastNWeekKeys(n: number, fromWeekKey: string = currentWeekKey()): string[] {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    keys.push(shiftWeekKey(fromWeekKey, -i));
  }
  return keys;
}

export function quarterKeyFor(date: Date): string {
  const q = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${q}`;
}

export function currentQuarterKey(): string {
  return quarterKeyFor(new Date());
}

export function quarterDateRange(quarterKey: string): { start: Date; end: Date } {
  const [yearStr, qStr] = quarterKey.split("-Q");
  const year = Number(yearStr);
  const q = Number(qStr);
  const start = new Date(year, (q - 1) * 3, 1);
  const end = new Date(year, q * 3, 0);
  return { start, end };
}

export function shiftQuarterKey(quarterKey: string, delta: number): string {
  const [yearStr, qStr] = quarterKey.split("-Q");
  let year = Number(yearStr);
  let q = Number(qStr) + delta;
  while (q > 4) {
    q -= 4;
    year += 1;
  }
  while (q < 1) {
    q += 4;
    year -= 1;
  }
  return `${year}-Q${q}`;
}

export function daysUntil(isoDate: string): number {
  return differenceInCalendarDays(parseISO(isoDate), new Date());
}

export function isWithinNextNDays(isoDate: string, n: number): boolean {
  const diff = daysUntil(isoDate);
  return diff >= 0 && diff <= n;
}

export function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}
