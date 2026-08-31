import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mpesaConfigured, stkQuery } from "@/lib/mpesa";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "missing ref" }, { status: 400 });

  const payment = await prisma.payment.findUnique({
    where: { publicRef: ref },
    select: {
      id: true,
      registrationId: true,
      status: true,
      amount: true,
      mpesaReceipt: true,
      resultDesc: true,
      checkoutRequestId: true,
      createdAt: true,
    },
  });
  if (!payment) return NextResponse.json({ error: "not found" }, { status: 404 });

  let status = payment.status;

  // Reconcile a stuck "PROCESSING" payment after ~25s via STK query.
  if (
    status === "PROCESSING" &&
    payment.checkoutRequestId &&
    mpesaConfigured() &&
    Date.now() - payment.createdAt.getTime() > 25_000
  ) {
    try {
      const q = await stkQuery(payment.checkoutRequestId);
      if (q && q.resultCode === 0) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: "PAID", resultCode: 0, resultDesc: q.resultDesc },
          }),
          prisma.eventRegistration.update({
            where: { id: payment.registrationId },
            data: { status: "CONFIRMED", paidAt: new Date() },
          }),
        ]);
        status = "PAID";
      } else if (q && [1032, 1037, 1].includes(q.resultCode)) {
        const next = q.resultCode === 1032 ? "CANCELLED" : "FAILED";
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: next, resultCode: q.resultCode, resultDesc: q.resultDesc },
        });
        status = next;
      }
    } catch {
      /* leave as PROCESSING; the callback remains the source of truth */
    }
  }

  return NextResponse.json({
    status,
    amount: payment.amount,
    receipt: payment.mpesaReceipt,
    message: payment.resultDesc,
  });
}
