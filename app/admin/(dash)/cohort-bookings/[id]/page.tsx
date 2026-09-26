import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { waHref } from "@/lib/whatsapp";
import {
  moveCohortBookingStatus,
  deleteCohortBooking,
  confirmClassPayment,
  rejectClassPayment,
  sendBookingEmail,
} from "@/actions/admin/leads";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.willaryrobotics.com";

export default async function CohortBookingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ emailed?: string }>;
}) {
  const { id } = await params;
  const { emailed } = await searchParams;
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
  const statusUrl = `${SITE_URL}/booking/${b.publicRef ?? ""}`;
  const confirmedWaText =
    `Hi ${b.name}, your place in "${b.cohort.title}" is confirmed. ` +
    `Reference ${ref}. Status: ${statusUrl}`;
  const reminderWaText =
    `Hi ${b.name}, just a reminder to complete your payment of KES ${expected} ` +
    `for "${b.cohort.title}" so we can get you ready for class. Reference ${ref}. ` +
    `Details: ${statusUrl}`;

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

      {emailed && (
        <div className="panel" style={{ borderColor: "var(--ok)" }}>
          Email sent to {b.email}.
        </div>
      )}

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
          {b.phone && expected > 0 && b.status !== "CONFIRMED" && (
            <a
              className="btn btn--ghost btn--sm"
              href={waHref(b.phone, reminderWaText)}
              target="_blank"
              rel="noreferrer"
            >
              Send payment reminder (WhatsApp)
            </a>
          )}
          {b.phone && (
            <a
              className="btn btn--ghost btn--sm"
              href={waHref(b.phone, confirmedWaText)}
              target="_blank"
              rel="noreferrer"
            >
              Message on WhatsApp
            </a>
          )}
        </div>
        <p className="hint" style={{ marginTop: 10 }}>
          These open WhatsApp with the message ready — you still tap send. Fully
          automatic WhatsApp sending needs the WhatsApp Business API set up
          separately; ask if you want that next.
        </p>
      </div>

      <div className="panel">
        <h2>Move to a different status</h2>
        <form action={moveCohortBookingStatus} className="inline-actions">
          <input type="hidden" name="id" value={b.id} />
          <select name="status" defaultValue={b.status}>
            {Object.values(BookingStatus).map((st) => (
              <option key={st} value={st}>
                {st.toLowerCase().replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <button className="btn btn--ghost btn--sm" type="submit">
            Move
          </button>
        </form>
      </div>

      <div className="panel">
        <h2>Send a direct email</h2>
        <form action={sendBookingEmail.bind(null, b.id)}>
          <div className="field">
            <label htmlFor="em-subject">Subject</label>
            <input
              id="em-subject"
              name="subject"
              required
              defaultValue={`Your booking for ${b.cohort.title}`}
            />
          </div>
          <div className="field">
            <label htmlFor="em-message">Message</label>
            <textarea
              id="em-message"
              name="message"
              rows={5}
              required
              defaultValue={`Hi ${b.name},\n\n`}
            />
          </div>
          <button className="btn btn--primary btn--sm" type="submit">
            Send email to {b.email}
          </button>
        </form>
      </div>

      <div className="panel">
        <form action={deleteCohortBooking.bind(null, b.id)}>
          <ConfirmButton className="btn-link" message="Delete this booking? This can't be undone.">
            Delete booking
          </ConfirmButton>
        </form>
      </div>
    </>
  );
}
