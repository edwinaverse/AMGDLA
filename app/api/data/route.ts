import { NextRequest, NextResponse } from "next/server";
import { loadDashboardData, saveDashboardData } from "@/lib/db";
import { withDefaults } from "@/lib/defaultData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await loadDashboardData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to load dashboard data", err);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = withDefaults(body);
    await saveDashboardData(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save dashboard data", err);
    return NextResponse.json({ error: "Failed to save dashboard data" }, { status: 500 });
  }
}
