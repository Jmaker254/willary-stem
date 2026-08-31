import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponse } from "@/lib/csv";
import { SubscriberStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const s = req.nextUrl.searchParams.get("status");
  const where: Prisma.SubscriberWhereInput =
    s && s !== "ALL" ? { status: s as SubscriberStatus } : {};

  const rows = await prisma.subscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const csv = toCsv(
    rows.map((r) => ({
      createdAt: r.createdAt,
      email: r.email,
      name: r.name,
      status: r.status,
      source: r.source,
      tags: r.tags,
      confirmedAt: r.confirmedAt,
      unsubscribedAt: r.unsubscribedAt,
    })),
  );
  return csvResponse(
    `subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
  );
}
