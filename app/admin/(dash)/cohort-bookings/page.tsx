import Link from "next/link";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { moveCohortBookingStatus, deleteCohortBooking } from "@/actions/admin/leads";
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
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td>
                    <Link href={`/admin/cohort-bookings/${r.id}`}>{r.name}</Link>
                    <div style={{ fontSize: "0.72rem", color: "var(--body)" }}>
                      CLS-{r.id.slice(-6).toUpperCase()}
                    </div>
                  </td>
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
                      {r.learnerName ? ` · ${r.learnerName}` : ""}
                    </div>
                  </td>
                  <td>
                    {r.mpesaCode ? (
                      <>
                        {r.mpesaCode}
                        <div style={{ fontSize: "0.72rem", color: "var(--body)" }}>
                          KES {r.amountClaimedKes ?? "?"}
                          {r.cohort.priceAmountKes &&
                          r.amountClaimedKes !== r.cohort.priceAmountKes
                            ? ` (exp ${r.cohort.priceAmountKes})`
                            : ""}
                        </div>
                      </>
                    ) : r.cohort.priceAmountKes ? (
                      <span style={{ color: "var(--body)" }}>
                        KES {r.cohort.priceAmountKes}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <Badge value={r.status} />
                  </td>
                  <td>
                    <div className="inline-actions">
                      <form action={moveCohortBookingStatus} className="inline-actions">
                        <input type="hidden" name="id" value={r.id} />
                        <select name="status" defaultValue={r.status}>
                          {Object.values(BookingStatus).map((s) => (
                            <option key={s} value={s}>
                              {s.toLowerCase().replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn--ghost btn--sm" type="submit">
                          Move
                        </button>
                      </form>
                      <form action={deleteCohortBooking.bind(null, r.id)}>
                        <ConfirmButton
                          className="btn-link"
                          message={`Delete ${r.name}'s booking? This can't be undone.`}
                        >
                          Delete
                        </ConfirmButton>
                      </form>
                    </div>
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
