import { NextRequest, NextResponse } from "next/server";
import { processQuery } from "@/lib/nlp";

// POST /api/nlp - Process a text query through the NLP engine
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, callerPhone } = body;

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing 'text' field" }, { status: 400 });
  }

  const result = processQuery(text, callerPhone);
  return NextResponse.json(result);
}
