import { neon } from "@neondatabase/serverless";
import { DashboardData } from "./types";
import { withDefaults } from "./defaultData";

export const DASHBOARD_USER_ID = "default";

function sql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  // Next.js patches global fetch with its Data Cache; without this the Neon
  // HTTP driver's requests can get cached across requests despite force-dynamic.
  return neon(process.env.DATABASE_URL, { fetchOptions: { cache: "no-store" } });
}

export async function loadDashboardData(): Promise<DashboardData> {
  const db = sql();
  const rows = await db`select data from dashboard where user_id = ${DASHBOARD_USER_ID}`;
  if (rows.length === 0) {
    return withDefaults(null);
  }
  return withDefaults(rows[0].data as Partial<DashboardData>);
}

export async function saveDashboardData(data: DashboardData): Promise<void> {
  const db = sql();
  await db`
    insert into dashboard (user_id, data, updated_at)
    values (${DASHBOARD_USER_ID}, ${JSON.stringify(data)}::jsonb, now())
    on conflict (user_id)
    do update set data = ${JSON.stringify(data)}::jsonb, updated_at = now()
  `;
}
