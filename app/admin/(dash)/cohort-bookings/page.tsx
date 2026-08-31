import Link from "next/link";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import { setCohortBookingStatus } from "@/actions/admin/leads";
import { BookingStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", ...Object.values(BookingStatus)];

export default async function CohortBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? "") ? sp.status! : "ALL";
  const where: Prisma.CohortBookingWhereInput =
    status !== "ALL" ? { status: status as BookingStatus } : {};

  const rows = await prisma.cohortBooking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { cohort: true },
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Class bookings</h1>
        <a
          className="btn btn--ghost btn--sm"
          href={`/admin/cohort-bookings/export?status=${status}`}
        >
          Export CSV
        </a>
      </div>

      <div className="admin-filters">
        {STATUSES.map((s) => (
          <Link key={s} href={`?status=${s}`} aria-current={status === s}>
            {s.toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="panel">
        {rows.length === 0 ? (
          <p>No bookings match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Class</th>
                <th>Learner</th>
                <th>Status</th>
                <th>Move to</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td>{r.name}</td>
                  <td>
                    {r.email}
                    {r.phone && (
                      <div style={{ fontSize: "0.72rem", color: "var(--body)" }}>
                        {r.phone}
                      </div>
                    )}
                  </td>
                  <td>
                    {r.cohort.title}
                    <div style={{ fontSize: "0.72rem", color: "var(--body)" }}>
                      {r.cohort.mode}
                    </div>
                  </td>
                  <td>
                    {r.learnerName ?? "—"}
                    {r.learnerAge ? `, ${r.learnerAge}` : ""}
                  </td>
                  <td>
                    <Badge value={r.status} />
                  </td>
                  <td>
                    <span className="inline-actions">
                      {Object.values(BookingStatus)
                        .filter((s) => s !== r.status)
                        .map((s) => (
                          <form
                            key={s}
                            action={setCohortBookingStatus.bind(null, r.id, s)}
                          >
                            <button className="btn-link" type="submit">
                              {s.toLowerCase()}
                            </button>
                          </form>
                        ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
