"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitClassPayment } from "@/actions/cohort-bookings";
import { BOOKING_FLOW_IDLE } from "@/lib/cohort-booking-state";
import SubmitButton from "./SubmitButton";
import { formatKes } from "@/lib/money";
import { waHref } from "@/lib/whatsapp";

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
          M-Pesa number: <strong>{paybill}</strong>
        </p>
        <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{payInfo}</p>
        <p className="pay-ref">
          Your booking reference: <strong>{reference}</strong> — mention it if
          you message us so we can match your payment faster.
        </p>
      </div>

      <form action={action} style={{ marginTop: 18 }}>
        <input type="hidden" name="publicRef" value={publicRef} />
        <div className="field">
          <label htmlFor="pay-message">Paste your M-Pesa confirmation message</label>
          <textarea
            id="pay-message"
            name="mpesaMessage"
            rows={4}
            placeholder={
              'e.g. "TIA7X2K9LM Confirmed. Ksh2,000.00 paid to WILLARY STEM. on 13/10/26 at 2:45 PM. New M-PESA balance is..."'
            }
            required
          />
          {fe.mpesaMessage && <p className="field-error">{fe.mpesaMessage}</p>}
          <p className="hint">
            Open the M-Pesa message on your phone and paste the whole thing —
            we read the code, amount and time straight from it.
          </p>
        </div>

        <SubmitButton className="btn btn--primary btn--block" pendingText="Submitting…">
          I&rsquo;ve paid — submit message
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
