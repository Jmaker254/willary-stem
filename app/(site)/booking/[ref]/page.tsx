import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/site/PageHero";
import { getBookingByRef, getSettings } from "@/lib/content";
import { formatKes } from "@/lib/money";

export const metadata: Metadata = {
  title: "Booking status",
  robots: { index: false },
};

function fmt(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function BookingStatusPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const [booking, settings] = await Promise.all([
    getBookingByRef(ref),
    getSettings(),
  ]);
  if (!booking) notFound();

  const c = booking.cohort;

  return (
    <>
      <PageHero>
        <p className="breadcrumb">
          <Link href="/">Home</Link> » <Link href="/programs">Classes</Link> »
          Booking {booking.ref}
        </p>
        <h1>{c.title}</h1>
        <p>
          Booking reference <strong>{booking.ref}</strong> · {booking.name}
        </p>
      </PageHero>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          {booking.status === "CONFIRMED" && (
            <div className="panel booking-status is-ok">
              <h2 style={{ marginTop: 0 }}>✅ You&rsquo;re confirmed</h2>
              <p>
                Your place in <strong>{c.title}</strong> is confirmed
                {booking.confirmedAt ? ` (${fmt(booking.confirmedAt)})` : ""}.
              </p>
              <ul className="facts">
                <li>{c.startText}</li>
                <li>{c.scheduleText}</li>
                {c.location && <li>{c.location}</li>}
              </ul>
              <p className="form-note">
                We&rsquo;ll be in touch with joining details before the start
                date. Questions? <Link href="/contact">Contact us</Link>.
              </p>
            </div>
          )}

          {booking.status === "PENDING_CONFIRMATION" && (
            <div className="panel booking-status is-pending">
              <h2 style={{ marginTop: 0 }}>Payment received — confirming</h2>
              <p>
                We&rsquo;ve got your M-Pesa details
                {booking.mpesaCode ? ` (code ${booking.mpesaCode})` : ""} and
                we&rsquo;re checking them against our statement. This usually
                takes under 2 hours. We&rsquo;ll email{" "}
                <strong>{booking.email}</strong> once it&rsquo;s confirmed.
              </p>
              {booking.amountClaimedKes != null && (
                <p className="form-note">
                  Amount submitted: {formatKes(booking.amountClaimedKes)}
                  {booking.paymentClaimedAt
                    ? ` · ${fmt(booking.paymentClaimedAt)}`
                    : ""}
                </p>
              )}
            </div>
          )}

          {booking.status === "AWAITING_PAYMENT" && (
            <div className="panel booking-status is-pending">
              <h2 style={{ marginTop: 0 }}>Payment not received yet</h2>
              <p>
                To hold your place in <strong>{c.title}</strong>, pay{" "}
                <strong>{formatKes(c.priceAmountKes)}</strong> and submit your
                M-Pesa code.
              </p>
              <div className="pay-box">
                <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {settings.classPayInfo}
                </p>
                <p className="pay-ref">
                  Use this as the account / reference:{" "}
                  <strong>{booking.ref}</strong>
                </p>
              </div>
              <p style={{ marginTop: 14 }}>
                <Link className="btn btn--primary" href="/programs#book">
                  Go to the booking form to submit your code
                </Link>
              </p>
            </div>
          )}

          {booking.status === "REJECTED" && (
            <div className="panel booking-status is-error">
              <h2 style={{ marginTop: 0 }}>We couldn&rsquo;t match your payment</h2>
              <p>
                We weren&rsquo;t able to match the M-Pesa details you sent to a
                payment on our statement. Please{" "}
                <Link href="/contact">contact us</Link> with your M-Pesa message
                and reference <strong>{booking.ref}</strong> and we&rsquo;ll sort
                it out.
              </p>
              <p className="form-note">
                {settings.phone} · {settings.email}
              </p>
            </div>
          )}

          {booking.status === "WAITLIST" && (
            <div className="panel booking-status is-pending">
              <h2 style={{ marginTop: 0 }}>You&rsquo;re on the waitlist</h2>
              <p>
                {c.title} is full. We&rsquo;ll email you at{" "}
                <strong>{booking.email}</strong> if a place opens up.
              </p>
            </div>
          )}

          {(booking.status === "NEW" || booking.status === "CANCELLED") && (
            <div className="panel booking-status">
              <h2 style={{ marginTop: 0 }}>
                {booking.status === "CANCELLED"
                  ? "This booking was cancelled"
                  : "Booking received"}
              </h2>
              <p>
                {booking.status === "CANCELLED"
                  ? "If this is a mistake, please contact us."
                  : "We've received your booking and will be in touch by email."}
              </p>
            </div>
          )}

          <p style={{ marginTop: 32 }}>
            <Link className="btn btn--ghost" href="/programs">
              ← All classes
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
