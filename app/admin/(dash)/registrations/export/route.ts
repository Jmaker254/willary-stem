import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponse } from "@/lib/csv";
import { RegistrationStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const s = req.nextUrl.searchParams.get("status");
  const where: Prisma.EventRegistrationWhereInput =
    s && s !== "ALL" ? { status: s as RegistrationStatus } : {};

  const rows = await prisma.eventRegistration.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const csv = toCsv(
    rows.map((r) => ({
      createdAt: r.createdAt,
      status: r.status,
      ticketType: r.ticketType,
      name: r.name,
      email: r.email,
      phone: r.phone,
      organisation: r.organisation,
      teamName: r.teamName,
      teamSize: r.teamSize,
      members: r.members,
      quantity: r.quantity,
      amount: r.amount,
      paymentStatus: r.payments[0]?.status ?? "",
      mpesaReceipt: r.payments[0]?.mpesaReceipt ?? "",
      paidAt: r.paidAt,
      trackInterest: r.trackInterest,
      notes: r.notes,
    })),
  );
  return csvResponse(
    `buildfest-registrations-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
  );
}
