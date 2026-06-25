import { NextResponse } from "next/server";
import { loadDashboardData } from "@/lib/db";
import { buildBriefing } from "@/lib/briefing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await loadDashboardData();
    const briefing = buildBriefing(data);
    return NextResponse.json(briefing);
  } catch (err) {
    console.error("Failed to build briefing", err);
    return NextResponse.json({ error: "Failed to build briefing" }, { status: 500 });
  }
}
