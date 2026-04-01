import { NextRequest, NextResponse } from "next/server";

const TELNYX_API_KEY = process.env.TELNYX_API_KEY!;

async function callAction(callControlId: string, action: string, body: object = {}) {
  await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/${action}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TELNYX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

const SALES_PITCH =
  "Salam! SmartTech Solutions şirkətindən zəng edirik. " +
  "Bu gün sizə Ağıllı Ev Hub sistemimizi təqdim etmək istəyirik. " +
  "Evinizi idarə edin, enerji qənaət edin, təhlükəsizliyi artırın. " +
  "Qiymət 599 manatdan başlayır. " +
  "Ətraflı məlumat almaq istəyirsinizsə bir deyin, imtina etmək istəyirsinizsə iki deyin.";

const INTERESTED_MSG =
  "Əla seçim! Mütəxəssisimiz ən qısa zamanda sizinlə əlaqə saxlayacaq. " +
  "Zəng etdiyimiz üçün təşəkkür edirik. Xoş günlər!";

const NOT_INTERESTED_MSG =
  "Başa düşdük, narahat etdiyimiz üçün üzr istəyirik. " +
  "Gələcəkdə lazım olsa bizimlə əlaqə saxlaya bilərsiniz. Sağ olun!";

const TIMEOUT_MSG =
  "Cavab eşidilmədi. Daha sonra yenidən zəng edəcəyik. Xoş günlər!";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const eventType: string = body.data?.event_type;
  const payload = body.data?.payload;
  const callControlId: string = payload?.call_control_id;

  if (!callControlId) {
    return NextResponse.json({ ok: true });
  }

  if (eventType === "call.initiated") {
    // Daxil olan zəng — cavab ver
    await callAction(callControlId, "answer", {});
  } else if (eventType === "call.answered") {
    // Zəng cavablandı — satış mesajı söylə, rəqəm topla
    await callAction(callControlId, "gather_using_speak", {
      payload: SALES_PITCH,
      voice: "female",
      language: "tr-TR",
      gather_id: "main",
      valid_digits: "12",
      minimum_digits: 1,
      maximum_digits: 1,
      timeout_millis: 8000,
      inter_digit_timeout_millis: 5000,
    });
  } else if (eventType === "call.gather.ended") {
    const digits: string = payload?.digits || "";
    const reason: string = payload?.reason || "";

    if (reason === "digit_timeout" || digits === "") {
      await callAction(callControlId, "speak", {
        payload: TIMEOUT_MSG,
        voice: "female",
        language: "tr-TR",
        command_id: "hangup_after",
      });
    } else if (digits === "1") {
      await callAction(callControlId, "speak", {
        payload: INTERESTED_MSG,
        voice: "female",
        language: "tr-TR",
        command_id: "hangup_after",
      });
    } else {
      await callAction(callControlId, "speak", {
        payload: NOT_INTERESTED_MSG,
        voice: "female",
        language: "tr-TR",
        command_id: "hangup_after",
      });
    }
  } else if (eventType === "call.speak.ended") {
    const commandId: string = payload?.command_id || "";
    if (commandId === "hangup_after") {
      await callAction(callControlId, "hangup", {});
    }
  }

  return NextResponse.json({ received: true });
}
