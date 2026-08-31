import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponse } from "@/lib/csv";
import { SubmissionStatus, SubmissionType, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const s = req.nextUrl.searchParams.get("status");
  const t = req.nextUrl.searchParams.get("type");
  const where: Prisma.SubmissionWhereInput = {
    ...(s && s !== "ALL" ? { status: s as SubmissionStatus } : {}),
    ...(t && t !== "ALL" ? { type: t as SubmissionType } : {}),
  };

  const rows = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const csv = toCsv(
    rows.map((r) => ({
      createdAt: r.createdAt,
      type: r.type,
      status: r.status,
      name: r.name,
      email: r.email,
      organisation: r.organisation,
      phone: r.phone,
      topic: r.topic,
      message: r.message,
      ip: r.ip,
    })),
  );
  return csvResponse(
    `submissions-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
  );
}
