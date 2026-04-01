import { NextRequest, NextResponse } from "next/server";

const TELNYX_API_KEY = process.env.TELNYX_API_KEY!;
const TELNYX_PHONE_NUMBER = process.env.TELNYX_PHONE_NUMBER!;
const CONNECTION_ID = "2928078981548738140";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const to: string = body.to;

  if (!to) {
    return NextResponse.json({ error: "Nömrə daxil edilməyib" }, { status: 400 });
  }

  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/telnyx/voice`;

  const res = await fetch("https://api.telnyx.com/v2/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TELNYX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      connection_id: CONNECTION_ID,
      to,
      from: TELNYX_PHONE_NUMBER,
      webhook_url: webhookUrl,
      webhook_url_method: "POST",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: 500 });
  }

  return NextResponse.json({ success: true, callId: data.data?.call_control_id });
}
