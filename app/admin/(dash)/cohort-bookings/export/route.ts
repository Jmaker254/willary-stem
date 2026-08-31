import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponse } from "@/lib/csv";
import { BookingStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const s = req.nextUrl.searchParams.get("status");
  const where: Prisma.CohortBookingWhereInput =
    s && s !== "ALL" ? { status: s as BookingStatus } : {};

  const rows = await prisma.cohortBooking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { cohort: true },
  });

  const csv = toCsv(
    rows.map((r) => ({
      createdAt: r.createdAt,
      status: r.status,
      class: r.cohort.title,
      mode: r.cohort.mode,
      name: r.name,
      email: r.email,
      phone: r.phone,
      learnerName: r.learnerName,
      learnerAge: r.learnerAge,
      notes: r.notes,
    })),
  );
  return csvResponse(
    `class-bookings-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
  );
}
