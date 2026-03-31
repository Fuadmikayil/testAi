import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { processQuery } from "@/lib/nlp";
import { addCallLog, upsertCallerProfile, getCallerProfile } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

const VoiceResponse = twilio.twiml.VoiceResponse;

// Twilio webhook: Process speech input from caller
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const speechResult = formData.get("SpeechResult")?.toString() || "";
  const callerNumber = formData.get("From")?.toString() || "unknown";
  const callSid = formData.get("CallSid")?.toString() || "";
  const confidence = parseFloat(formData.get("Confidence")?.toString() || "0");

  // Process the speech through NLP
  const nlpResult = processQuery(speechResult, callerNumber);

  const twiml = new VoiceResponse();

  // Sİ cavabını səsləndirin
  twiml.say(
    {
      voice: "Polly.Joanna",
      language: "tr-TR",
    },
    nlpResult.responseText
  );

  // Söhbətin bitib-bitmədiyini yoxlayın
  if (nlpResult.intent === "farewell") {
    twiml.hangup();
  } else {
    // Danışığı toplamağa davam edin
    const gather = twiml.gather({
      input: ["speech"],
      action: "/api/twilio/process-speech",
      method: "POST",
      speechTimeout: "auto",
      language: "tr-TR",
    });

    gather.say(
      { voice: "Polly.Joanna", language: "tr-TR" },
      "Başqa kömək edə biləcəyim bir şey varmı?"
    );

    twiml.redirect("/api/twilio/voice");
  }

  // Update caller profile with interaction data
  const existingProfile = getCallerProfile(callerNumber);
  const newPreferences = [
    ...nlpResult.suggestedProducts,
    ...nlpResult.suggestedServices,
  ];

  upsertCallerProfile({
    id: existingProfile?.id || uuidv4(),
    phoneNumber: callerNumber,
    name: existingProfile?.name,
    preferences: [
      ...new Set([...(existingProfile?.preferences || []), nlpResult.intent]),
    ],
    previousInteractions: [
      ...(existingProfile?.previousInteractions || []),
      callSid,
    ],
    lastCallDate: new Date().toISOString(),
  });

  // Log the interaction
  addCallLog({
    id: uuidv4(),
    callerNumber,
    callSid,
    timestamp: new Date().toISOString(),
    duration: 0,
    status: "in-progress",
    transcript: [
      `Zəng edən: ${speechResult}`,
      `Sİ: ${nlpResult.responseText}`,
    ],
    querySummary: `Intent: ${nlpResult.intent} (${Math.round(nlpResult.confidence * 100)}% confidence)`,
    recommendedItems: [...nlpResult.suggestedProducts, ...nlpResult.suggestedServices],
    sentiment: nlpResult.confidence > 0.7 ? "positive" : "neutral",
  });

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
