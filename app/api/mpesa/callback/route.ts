import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

/** Safaricom always expects a 200 with this ack body. */
const ACK = NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

interface MetaItem {
  Name: string;
  Value?: string | number;
}

export async function POST(req: NextRequest) {
  const secret = process.env.MPESA_CALLBACK_SECRET;
  if (secret && req.nextUrl.searchParams.get("token") !== secret) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Rejected" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return ACK;
  }

  const cb = (body as { Body?: { stkCallback?: Record<string, unknown> } })?.Body
    ?.stkCallback;
  if (!cb) return ACK;

  const checkoutRequestId = String(cb.CheckoutRequestID ?? "");
  const resultCode = Number(cb.ResultCode ?? -1);
  const resultDesc = String(cb.ResultDesc ?? "");
  const items: MetaItem[] =
    (cb.CallbackMetadata as { Item?: MetaItem[] })?.Item ?? [];
  const meta = Object.fromEntries(items.map((i) => [i.Name, i.Value]));

  const payment = await prisma.payment.findUnique({
    where: { checkoutRequestId },
    include: { registration: true },
  });
  if (!payment) return ACK; // unknown / already handled

  if (resultCode === 0) {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          resultCode,
          resultDesc,
          mpesaReceipt: meta.MpesaReceiptNumber ? String(meta.MpesaReceiptNumber) : null,
          rawCallback: body as object,
        },
      }),
      prisma.eventRegistration.update({
        where: { id: payment.registrationId },
        data: { status: "CONFIRMED", paidAt: new Date() },
      }),
    ]);
    await sendNotification(
      `BuildFest payment received — ${payment.registration.name}`,
      `KES ${payment.amount} · Receipt ${meta.MpesaReceiptNumber ?? "?"} · ${payment.registration.email}`,
    );
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: resultCode === 1032 ? "CANCELLED" : "FAILED",
        resultCode,
        resultDesc,
        rawCallback: body as object,
      },
    });
  }

  return ACK;
}
