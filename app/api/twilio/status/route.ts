import { NextRequest, NextResponse } from "next/server";
import { addCallLog, getAllCallLogs } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

// Twilio webhook: Call status callback
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const callSid = formData.get("CallSid")?.toString() || "";
  const callStatus = formData.get("CallStatus")?.toString() || "";
  const callDuration = parseInt(formData.get("CallDuration")?.toString() || "0");

  // Update existing call log with final status
  const logs = getAllCallLogs();
  const existingLog = logs.find((l) => l.callSid === callSid);

  if (existingLog) {
    existingLog.status = callStatus === "completed" ? "completed" : "failed";
    existingLog.duration = callDuration;
  }

  return NextResponse.json({ status: "ok" });
}
