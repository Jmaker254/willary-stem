"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { bookCohort } from "@/actions/cohort-bookings";
import { BOOKING_FLOW_IDLE } from "@/lib/cohort-booking-state";
import SubmitButton from "./SubmitButton";
import ClassPayStep from "./ClassPayStep";
import { formatKes } from "@/lib/money";
import { waHref } from "@/lib/whatsapp";
import type { Cohort } from "@/lib/types";

function WhatsAppLink({ sitePhone, text }: { sitePhone?: string; text: string }) {
  if (!sitePhone) return null;
  return (
    <a
      className="btn btn--ghost btn--sm"
      href={waHref(sitePhone, text)}
      target="_blank"
      rel="noreferrer"
    >
      Message us on WhatsApp
    </a>
  );
}

function PayOrWaitStep({
  publicRef,
  reference,
  amountKes,
  payInfo,
  cohortTitle,
  sitePhone,
}: {
  publicRef: string;
  reference: string;
  amountKes: number;
  payInfo: string;
  cohortTitle: string;
  sitePhone?: string;
}) {
  const [choice, setChoice] = useState<"choice" | "pay" | "waiting">("choice");

  if (choice === "pay") {
    return (
      <ClassPayStep
        publicRef={publicRef}
        reference={reference}
        amountKes={amountKes}
        payInfo={payInfo}
        cohortTitle={cohortTitle}
      />
    );
  }

  if (choice === "waiting") {
    return (
      <div className="form-card" role="status">
        <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>You&rsquo;re on the list</h2>
        <p>
          You&rsquo;ve got a spot held for <strong>{cohortTitle}</strong> —
          reference <strong>{reference}</strong>. Pay any time before the class
          starts to confirm it.
        </p>
        <p className="form-note">
          Amount: {formatKes(amountKes)}. We&rsquo;ll follow up by email as a
          reminder — you can also come back and pay whenever you&rsquo;re ready.
        </p>
        <div className="inline-actions" style={{ marginTop: 12 }}>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => setChoice("pay")}
          >
            Actually, pay now
          </button>
          <Link className="btn btn--ghost btn--sm" href={`/booking/${publicRef}`}>
            View booking status
          </Link>
          <WhatsAppLink
            sitePhone={sitePhone}
            text={`Hi, I just reserved a spot in "${cohortTitle}" (ref ${reference}). I'll pay before the class starts.`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>Reserve your place</h2>
      <p>
        <strong>{cohortTitle}</strong> — {formatKes(amountKes)}
      </p>
      <p>
        Payments are open now, but you don&rsquo;t have to pay right away —
        you can just join the list and pay any time before the class starts.
      </p>
      <div className="inline-actions" style={{ marginTop: 12 }}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setChoice("pay")}
        >
          Pay now with M-Pesa
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setChoice("waiting")}
        >
          Just add me to the list
        </button>
      </div>
    </div>
  );
}

export default function CohortBookingForm({
  cohorts,
  defaultCohortId,
  sitePhone,
}: {
  cohorts: Cohort[];
  defaultCohortId?: string;
  sitePhone?: string;
}) {
  const [state, action] = useActionState(bookCohort, BOOKING_FLOW_IDLE);
  const bookable = cohorts.filter((c) => c.status !== "CLOSED");

  if (state.status === "pay") {
    return (
      <PayOrWaitStep
        publicRef={state.publicRef}
        reference={state.ref}
        amountKes={state.amountKes}
        payInfo={state.payInfo}
        cohortTitle={state.cohortTitle}
        sitePhone={sitePhone}
      />
    );
  }

  if (state.status === "submitted") {
    return (
      <div className="form-card" role="status">
        <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>Payment details received</h2>
        <p>{state.message}</p>
        <p style={{ marginTop: 16 }}>
          <Link className="btn btn--primary" href={`/booking/${state.publicRef}`}>
            Check your booking status
          </Link>
        </p>
      </div>
    );
  }

  if (state.status === "waitlisted" || state.status === "booked_free") {
    return (
      <div className="form-card" role="status">
        <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>
          {state.status === "waitlisted" ? "You're on the waitlist" : "Booking received"}
        </h2>
        <p className="form-feedback is-ok">{state.message}</p>
        <p style={{ marginTop: 12 }}>
          <WhatsAppLink
            sitePhone={sitePhone}
            text="Hi, I just booked a class on your website — following up here too!"
          />
        </p>
      </div>
    );
  }

  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="form-card" id="book">
      <h2 style={{ fontSize: "1.3rem" }}>Book a class</h2>

      <div className="hp-field" aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="b-cohort">Class</label>
        <select
          id="b-cohort"
          name="cohortId"
          defaultValue={defaultCohortId ?? bookable[0]?.id ?? ""}
          required
        >
          {bookable.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} — {c.mode === "ONLINE" ? "Online" : c.mode === "HYBRID" ? "Hybrid" : "In person"} · {c.startText}
              {c.status === "FULL" ? " (full — waitlist)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="b-name">Your name</label>
        <input id="b-name" name="name" required />
        {fe.name && <p className="field-error">{fe.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="b-email">Email</label>
        <input id="b-email" type="email" name="email" required />
        {fe.email && <p className="field-error">{fe.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="b-phone">Phone / WhatsApp (the number you&rsquo;ll pay from)</label>
        <input
          id="b-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="07XX XXX XXX"
          required
        />
        {fe.phone && <p className="field-error">{fe.phone}</p>}
      </div>

      <div className="admin-form" style={{ maxWidth: "none" }}>
        <div className="row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="field">
            <label htmlFor="b-learner">Learner name (if not you)</label>
            <input id="b-learner" name="learnerName" />
          </div>
          <div className="field">
            <label htmlFor="b-age">Learner age</label>
            <input id="b-age" name="learnerAge" placeholder="e.g. 12" />
          </div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="b-notes">Anything else? (optional)</label>
        <textarea id="b-notes" name="notes" />
      </div>

      <SubmitButton className="btn btn--primary btn--block" pendingText="Sending…">
        Request a place
      </SubmitButton>
      {state.status === "error" && (
        <p className="form-feedback is-error" role="status">
          {state.message}
        </p>
      )}
      <p className="form-note">
        Paid classes let you pay by M-Pesa right away or just reserve a spot
        and pay later; we confirm your place by email once payment is
        received.
      </p>
    </form>
  );
}
