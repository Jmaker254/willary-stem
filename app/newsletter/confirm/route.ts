import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  if (token) {
    const sub = await prisma.subscriber.findUnique({ where: { token } });
    if (sub && sub.status !== "UNSUBSCRIBED") {
      await prisma.subscriber.update({
        where: { id: sub.id },
        data: { status: "ACTIVE", confirmedAt: new Date() },
      });
    }
  }
  return NextResponse.redirect(`${site}/newsletter/confirmed`);
}
