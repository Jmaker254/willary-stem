import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { mpesaConfigured, devBypass, stkPush } from "@/lib/mpesa";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = await clientIp();
  const rl = rateLimit(`retry:${ip}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Slow down and try again shortly." }, { status: 429 });

  let ref = "";
  try {
    ref = String((await req.json())?.ref ?? "");
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { publicRef: ref } });
  if (!payment) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (payment.status === "PAID")
    return NextResponse.json({ ok: true, status: "PAID" });

  if (devBypass()) {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", mpesaReceipt: "DEV-BYPASS", resultCode: 0 },
      }),
      prisma.eventRegistration.update({
        where: { id: payment.registrationId },
        data: { status: "CONFIRMED", paidAt: new Date() },
      }),
    ]);
    return NextResponse.json({ ok: true, status: "PAID" });
  }

  if (!mpesaConfigured())
    return NextResponse.json({ error: "Online payment isn't set up yet." }, { status: 503 });

  try {
    const stk = await stkPush({
      phone: payment.phone,
      amount: payment.amount,
      accountRef: payment.accountRef,
      description: "BuildFest",
    });
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PROCESSING",
        merchantRequestId: stk.merchantRequestId,
        checkoutRequestId: stk.checkoutRequestId,
        resultCode: null,
        resultDesc: null,
      },
    });
    return NextResponse.json({ ok: true, status: "PROCESSING", message: stk.customerMessage });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Retry failed" },
      { status: 400 },
    );
  }
}
