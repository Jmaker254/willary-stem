"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitClassPayment } from "@/actions/cohort-bookings";
import { BOOKING_FLOW_IDLE } from "@/lib/cohort-booking-state";
import SubmitButton from "./SubmitButton";
import { formatKes } from "@/lib/money";
import { waHref } from "@/lib/whatsapp";

/** "YYYY-MM-DDTHH:mm" in the browser's local time, for a datetime-local default. */
function localDatetimeValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ClassPayStep({
  publicRef,
  reference,
  amountKes,
  paybill,
  payInfo,
  cohortTitle,
  sitePhone,
}: {
  publicRef: string;
  reference: string;
  amountKes: number;
  paybill: string;
  payInfo: string;
  cohortTitle: string;
  sitePhone?: string;
}) {
  const [state, action] = useActionState(submitClassPayment, BOOKING_FLOW_IDLE);

  if (state.status === "submitted") {
    return (
      <div className="form-card" role="status">
        <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>Payment details received</h2>
        <p>{state.message}</p>
        <div className="inline-actions" style={{ marginTop: 16 }}>
          <Link className="btn btn--primary" href={`/booking/${publicRef}`}>
            Check your booking status
          </Link>
          {sitePhone && (
            <a
              className="btn btn--ghost"
              href={waHref(
                sitePhone,
                `Hi, I just submitted my M-Pesa payment for "${cohortTitle}" (ref ${reference}).`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              Message us on WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <div className="form-card">
      <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>Pay to hold your place</h2>
      <p>
        <strong>{cohortTitle}</strong> — amount to pay:{" "}
        <strong>{formatKes(amountKes)}</strong>
      </p>

      <div className="pay-box">
        <p className="pay-paybill">
          Pay Bill: <strong>{paybill}</strong>
        </p>
        <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{payInfo}</p>
        <p className="pay-ref">
          Use this as the account / reference: <strong>{reference}</strong>
        </p>
      </div>

      <form action={action} style={{ marginTop: 18 }}>
        <input type="hidden" name="publicRef" value={publicRef} />
        <div className="field">
          <label htmlFor="pay-code">M-Pesa confirmation code</label>
          <input
            id="pay-code"
            name="mpesaCode"
            placeholder="e.g. TIA7X2K9LM"
            autoCapitalize="characters"
            required
          />
          {fe.mpesaCode && <p className="field-error">{fe.mpesaCode}</p>}
        </div>
        <div className="field">
          <label htmlFor="pay-amount">Amount you paid (KES)</label>
          <input
            id="pay-amount"
            name="amount"
            type="number"
            inputMode="numeric"
            defaultValue={amountKes}
            required
          />
          {fe.amount && <p className="field-error">{fe.amount}</p>}
        </div>
        <div className="field">
          <label htmlFor="pay-time">Date &amp; time on your M-Pesa message</label>
          <input
            id="pay-time"
            name="paidAt"
            type="datetime-local"
            defaultValue={localDatetimeValue(new Date())}
            required
          />
          {fe.paidAt && <p className="field-error">{fe.paidAt}</p>}
          <p className="hint">
            We check this against your application time to confirm the message
            is genuine and recent.
          </p>
        </div>

        <SubmitButton className="btn btn--primary btn--block" pendingText="Submitting…">
          I&rsquo;ve paid — submit code
        </SubmitButton>
        {state.status === "error" && (
          <p className="form-feedback is-error" role="status">
            {state.message}
          </p>
        )}
        <p className="form-note">
          We verify the payment against our M-Pesa statement and email you once
          your place is confirmed (usually within 2 hours).
        </p>
      </form>
    </div>
  );
}
