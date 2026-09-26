import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import ConfirmButton from "@/components/admin/ConfirmButton";
import {
  setCohortBookingStatus,
  deleteCohortBooking,
  confirmClassPayment,
  rejectClassPayment,
} from "@/actions/admin/leads";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.willaryrobotics.com";

export default async function CohortBookingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const b = await prisma.cohortBooking.findUnique({
    where: { id },
    include: { cohort: true },
  });
  if (!b) notFound();

  const ref = `CLS-${b.id.slice(-6).toUpperCase()}`;
  const expected = b.cohort.priceAmountKes;
  const mismatch =
    b.amountClaimedKes != null &&
    expected > 0 &&
    b.amountClaimedKes !== expected;
  const waPhone = (b.phone ?? "").replace(/\D/g, "");
  const waText = encodeURIComponent(
    `Hi ${b.name}, your place in "${b.cohort.title}" is confirmed. ` +
      `Reference ${ref}. Status: ${SITE_URL}/booking/${b.publicRef ?? ""}`,
  );

  return (
    <>
      <p className="breadcrumb" style={{ color: "var(--body)" }}>
        <Link href="/admin/cohort-bookings">← All class bookings</Link>
      </p>
      <div className="admin-topbar">
        <h1>
          {b.cohort.title} · {b.name}
        </h1>
        <Badge value={b.status} />
      </div>

      <div className="panel">
        <table className="admin-table">
          <tbody>
            <tr>
              <th style={{ width: 170 }}>Reference</th>
              <td>{ref}</td>
            </tr>
            <tr>
              <th>Booked</th>
              <td>{b.createdAt.toISOString().replace("T", " ").slice(0, 19)}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>
                <a href={`mailto:${b.email}`}>{b.email}</a>
              </td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{b.phone ?? "—"}</td>
            </tr>
            {b.learnerName && (
              <tr>
                <th>Learner</th>
                <td>
                  {b.learnerName}
                  {b.learnerAge ? `, ${b.learnerAge}` : ""}
                </td>
              </tr>
            )}
            <tr>
              <th>Class</th>
              <td>
                {b.cohort.title} ({b.cohort.mode})
                <div style={{ fontSize: "0.8rem", color: "var(--body)" }}>
                  {b.cohort.startText} · {b.cohort.scheduleText}
                </div>
              </td>
            </tr>
            {b.notes && (
              <tr>
                <th>Notes</th>
                <td style={{ whiteSpace: "pre-wrap" }}>{b.notes}</td>
              </tr>
            )}
            <tr>
              <th>Status page</th>
              <td>
                {b.publicRef ? (
                  <a
                    href={`/booking/${b.publicRef}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    /booking/{b.publicRef}
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Payment</h2>
        <table className="admin-table">
          <tbody>
            <tr>
              <th style={{ width: 170 }}>Price to charge</th>
              <td>{expected > 0 ? `KES ${expected}` : "Free class"}</td>
            </tr>
            <tr>
              <th>M-Pesa code (claimed)</th>
              <td>{b.mpesaCode ?? "—"}</td>
            </tr>
            <tr>
              <th>Amount claimed</th>
              <td style={mismatch ? { color: "var(--danger)", fontWeight: 700 } : undefined}>
                {b.amountClaimedKes != null ? `KES ${b.amountClaimedKes}` : "—"}
                {mismatch ? ` — does not match expected KES ${expected}` : ""}
              </td>
            </tr>
            <tr>
              <th>Claimed at</th>
              <td>
                {b.paymentClaimedAt
                  ? b.paymentClaimedAt.toISOString().replace("T", " ").slice(0, 19)
                  : "—"}
              </td>
            </tr>
            <tr>
              <th>Confirmed at</th>
              <td>
                {b.confirmedAt
                  ? b.confirmedAt.toISOString().replace("T", " ").slice(0, 19)
                  : "—"}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="inline-actions" style={{ marginTop: 14 }}>
          <form action={confirmClassPayment.bind(null, b.id)}>
            <ConfirmButton
              className="btn btn--primary btn--sm"
              message="Confirm this M-Pesa payment and email the customer?"
            >
              Confirm payment
            </ConfirmButton>
          </form>
          <form action={rejectClassPayment.bind(null, b.id)}>
            <ConfirmButton
              className="btn btn--ghost btn--sm"
              message="Reject this payment and email the customer to get in touch?"
            >
              Reject payment
            </ConfirmButton>
          </form>
          {waPhone && (
            <a
              className="btn btn--ghost btn--sm"
              href={`https://wa.me/${waPhone}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
            >
              Message on WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Set status manually</h2>
        <div className="inline-actions">
          {Object.values(BookingStatus).map((st) => (
            <form key={st} action={setCohortBookingStatus.bind(null, b.id, st)}>
              <button
                className="btn btn--ghost btn--sm"
                type="submit"
                disabled={st === b.status}
              >
                {st.toLowerCase().replace(/_/g, " ")}
              </button>
            </form>
          ))}
        </div>
      </div>

      <div className="panel">
        <form action={deleteCohortBooking.bind(null, b.id)}>
          <ConfirmButton className="btn-link" message="Delete this booking?">
            Delete booking
          </ConfirmButton>
        </form>
      </div>
    </>
  );
}
