import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { processQuery } from "@/lib/nlp";
import { addCallLog, getCallerProfile, upsertCallerProfile } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

const VoiceResponse = twilio.twiml.VoiceResponse;

function buildVoiceTwiml(callerNumber?: string) {
  const profile = callerNumber ? getCallerProfile(callerNumber) : undefined;
  const greeting = profile?.name
    ? `Salam ${profile.name}! SmartTech Solutions-a yenidən xoş gəlmisiniz.`
    : "Salam! SmartTech Solutions-a xoş gəlmisiniz.";

  const twiml = new VoiceResponse();

  twiml.say(
    {
      voice: "Polly.Joanna",
      language: "tr-TR",
    },
    `${greeting} Bu gün sizə necə kömək edə bilərəm? Məhsullarımız, xidmətlərimiz və ya texniki dəstək haqqında soruşa bilərsiniz.`
  );

  const gather = twiml.gather({
    input: ["speech"],
    action: "/api/twilio/process-speech",
    method: "POST",
    speechTimeout: "auto",
    language: "tr-TR",
  });

  gather.say(
    { voice: "Polly.Joanna", language: "tr-TR" },
    "Zəhmət olmasa nə axtardığınızı söyləyin."
  );

  twiml.redirect("/api/twilio/voice");

  return { twiml, greeting };
}

export async function GET() {
  const { twiml } = buildVoiceTwiml();

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

// Twilio webhook: Incoming voice call handler
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const callerNumber = formData.get("From")?.toString() || "unknown";
  const callSid = formData.get("CallSid")?.toString() || uuidv4();
  const { twiml, greeting } = buildVoiceTwiml(callerNumber);

  // Log the call start
  addCallLog({
    id: uuidv4(),
    callerNumber,
    callSid,
    timestamp: new Date().toISOString(),
    duration: 0,
    status: "in-progress",
    transcript: [`Sİ: ${greeting} Bu gün sizə necə kömək edə bilərəm?`],
    querySummary: "",
    recommendedItems: [],
    sentiment: "neutral",
  });

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
