"use client";

import { useActionState } from "react";
import { bookCohort } from "@/actions/cohort-bookings";
import { IDLE } from "@/lib/form";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";
import type { Cohort } from "@/lib/types";

export default function CohortBookingForm({
  cohorts,
  defaultCohortId,
}: {
  cohorts: Cohort[];
  defaultCohortId?: string;
}) {
  const [state, action] = useActionState(bookCohort, IDLE);
  const bookable = cohorts.filter((c) => c.status !== "CLOSED");

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
      </div>
      <div className="field">
        <label htmlFor="b-email">Email</label>
        <input id="b-email" type="email" name="email" required />
      </div>
      <div className="field">
        <label htmlFor="b-phone">Phone / WhatsApp</label>
        <input id="b-phone" name="phone" inputMode="tel" placeholder="07XX XXX XXX" />
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
      <FormMessage state={state} />
      <p className="form-note">
        This is a booking request — we confirm your place and send payment
        details by email.
      </p>
    </form>
  );
}
