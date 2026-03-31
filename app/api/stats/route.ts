import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getDashboardStats());
}
