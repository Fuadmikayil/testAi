import { NextResponse } from "next/server";
import { getAllCallLogs } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getAllCallLogs());
}
