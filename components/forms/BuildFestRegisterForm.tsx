"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { registerForBuildFest } from "@/actions/registrations";
import { REGISTER_IDLE } from "@/lib/register-state";
import SubmitButton from "./SubmitButton";

const TICKET_TYPES = [
  { value: "TEAM", label: "Main Challenge team (1–5 people)" },
  { value: "SCHOOL_GROUP", label: "Junior Builder Programme (school team)" },
  { value: "STUDENT", label: "Student attendee" },
  { value: "GENERAL", label: "General attendee" },
  { value: "EXHIBITOR", label: "Exhibitor" },
];

const TEAM_LIMITS: Record<string, { min: number; max: number }> = {
  TEAM: { min: 1, max: 5 },
  SCHOOL_GROUP: { min: 1, max: 20 },
};
const isTeam = (t: string) => t === "TEAM" || t === "SCHOOL_GROUP";

const TRACKS = [
  "Water & Environmental Protection",
  "Smart Waste Collection",
  "Waste Sorting",
  "Recycling",
  "Waste-to-Business",
  "Circular Economy",
  "AI & Computer Vision",
  "Smart Cities",
];

export default function BuildFestRegisterForm({
  ticketKes = "500",
}: {
  ticketKes?: string;
}) {
  const [state, action] = useActionState(registerForBuildFest, REGISTER_IDLE);
  const price = Number(ticketKes) || 500;

  const [ticketType, setTicketType] = useState("GENERAL");
  const [size, setSize] = useState(2);

  const team = isTeam(ticketType);
  const lim = TEAM_LIMITS[ticketType] ?? { min: 1, max: 1 };
  const clampedSize = team ? Math.min(Math.max(size, lim.min), lim.max) : 1;
  const total = clampedSize * price;

  if (state.status === "prompt") {
    return (
      <div className="form-card">
        <PaymentPrompt
          publicRef={state.publicRef}
          amount={state.amount}
          phoneMasked={state.phoneMasked}
          message={state.message}
          initialPaid={state.paid}
        />
      </div>
    );
  }

  if (state.status === "waitlisted") {
    return (
      <div className="form-card">
        <h2 style={{ fontSize: "1.3rem" }}>You&apos;re on the waitlist</h2>
        <p className="form-feedback is-ok">{state.message}</p>
      </div>
    );
  }

  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="form-card">
      <h2 style={{ fontSize: "1.3rem" }}>Register for Willary BuildFest 2026</h2>

      <div className="hp-field" aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="r-type">Ticket type</label>
        <select
          id="r-type"
          name="ticketType"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
        >
          {TICKET_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {fe.ticketType && <p className="field-error">{fe.ticketType}</p>}
      </div>

      <div className="field">
        <label htmlFor="r-name">
          {team ? "Lead / contact name" : "Full name"}
        </label>
        <input id="r-name" name="name" required />
        {fe.name && <p className="field-error">{fe.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="r-email">Email</label>
        <input id="r-email" type="email" name="email" required />
        {fe.email && <p className="field-error">{fe.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="r-phone">Safaricom number to bill (M-Pesa)</label>
        <input
          id="r-phone"
          name="phone"
          inputMode="tel"
          placeholder="07XX XXX XXX"
          required
        />
        <p className="hint">
          You&apos;ll get an M-Pesa PIN prompt on this number for KES {ticketKes}{" "}
          per attendee.
        </p>
        {fe.phone && <p className="field-error">{fe.phone}</p>}
      </div>
      <div className="field">
        <label htmlFor="r-org">Organisation / school (optional)</label>
        <input id="r-org" name="organisation" />
      </div>

      <div className="field">
        <label htmlFor="r-track">Track of interest (optional)</label>
        <select id="r-track" name="trackInterest" defaultValue="">
          <option value="">No preference</option>
          {TRACKS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {team && (
        <div className="team-block">
          <div className="field">
            <label htmlFor="r-team">Team name</label>
            <input id="r-team" name="teamName" required />
          </div>
          <div className="field">
            <label htmlFor="r-size">
              Number of members — {lim.min}–{lim.max} people
            </label>
            <input
              id="r-size"
              name="teamSize"
              type="number"
              min={lim.min}
              max={lim.max}
              value={clampedSize}
              onChange={(e) => setSize(Number(e.target.value) || lim.min)}
            />
            {fe.teamSize && <p className="field-error">{fe.teamSize}</p>}
          </div>

          <div className="field">
            <label>
              Team member names — list all {clampedSize}
            </label>
            {Array.from({ length: clampedSize }).map((_, i) => (
              <input
                key={i}
                name="member"
                required
                placeholder={`Member ${i + 1} full name`}
                style={{ marginBottom: 8 }}
              />
            ))}
            {fe.members && <p className="field-error">{fe.members}</p>}
          </div>

          <p className="team-total">
            {clampedSize} × KES {price.toLocaleString()} ={" "}
            <strong>KES {total.toLocaleString()}</strong>
          </p>
        </div>
      )}

      <div className="field">
        <label htmlFor="r-notes">Anything else? (optional)</label>
        <textarea id="r-notes" name="notes" />
      </div>

      <SubmitButton
        className="btn btn--primary btn--block"
        pendingText="Sending M-Pesa prompt…"
      >
        {team
          ? `Register & pay KES ${total.toLocaleString()} with M-Pesa`
          : `Register & pay KES ${price.toLocaleString()} with M-Pesa`}
      </SubmitButton>
      {state.status === "error" && (
        <p className="form-feedback is-error" role="status">
          {state.message}
        </p>
      )}
      <p className="form-note">
        KES {ticketKes} per attendee, paid on the spot via M-Pesa
        {team ? " — the whole team on one prompt" : ""}. Your place is confirmed
        once payment goes through.
      </p>
    </form>
  );
}

type PayStatus = "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED";

function PaymentPrompt({
  publicRef,
  amount,
  phoneMasked,
  message,
  initialPaid,
}: {
  publicRef: string;
  amount: number;
  phoneMasked: string;
  message: string;
  initialPaid?: boolean;
}) {
  const [status, setStatus] = useState<PayStatus>(
    initialPaid ? "PAID" : "PROCESSING",
  );
  const [receipt, setReceipt] = useState<string | null>(null);
  const [note, setNote] = useState(message);
  const [retrying, setRetrying] = useState(false);
  const tries = useRef(0);

  useEffect(() => {
    if (status === "PAID" || status === "FAILED" || status === "CANCELLED") return;
    let live = true;
    const poll = async () => {
      tries.current += 1;
      try {
        const res = await fetch(
          `/api/mpesa/status?ref=${encodeURIComponent(publicRef)}`,
          { cache: "no-store" },
        );
        const j = await res.json();
        if (!live) return;
        if (j.status) setStatus(j.status as PayStatus);
        if (j.receipt) setReceipt(j.receipt);
        if (j.message) setNote(j.message);
      } catch {
        /* keep polling */
      }
      if (live && tries.current > 40) {
        setStatus("FAILED");
        setNote("We didn't get a confirmation in time.");
      }
    };
    const t = setInterval(poll, 3000);
    poll();
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [publicRef, status]);

  async function retry() {
    setRetrying(true);
    setNote("Sending a new M-Pesa prompt…");
    try {
      const res = await fetch("/api/mpesa/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: publicRef }),
      });
      const j = await res.json();
      if (j.ok) {
        setStatus(j.status === "PAID" ? "PAID" : "PROCESSING");
        tries.current = 0;
        setNote(j.message ?? "Check your phone for the M-Pesa prompt.");
      } else {
        setNote(j.error ?? "Couldn't resend the prompt.");
      }
    } catch {
      setNote("Couldn't resend the prompt.");
    } finally {
      setRetrying(false);
    }
  }

  if (status === "PAID") {
    return (
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <div style={{ fontSize: "2.4rem" }}>✅</div>
        <h2 style={{ fontSize: "1.3rem" }}>You&apos;re registered!</h2>
        <p>
          Payment of <strong>KES {amount.toLocaleString()}</strong> received.
          {receipt && receipt !== "DEV-BYPASS" ? (
            <>
              {" "}
              M-Pesa receipt <strong>{receipt}</strong>.
            </>
          ) : null}
        </p>
        <p className="form-note">
          A confirmation email is on its way. See you at BuildFest 2026.
        </p>
      </div>
    );
  }

  if (status === "FAILED" || status === "CANCELLED") {
    return (
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <div style={{ fontSize: "2.4rem" }}>⚠️</div>
        <h2 style={{ fontSize: "1.3rem" }}>Payment didn&apos;t go through</h2>
        <p>
          {status === "CANCELLED"
            ? "The M-Pesa request was cancelled."
            : note || "The payment wasn't completed."}
        </p>
        <p className="form-note">
          Your registration is saved as pending. Try the prompt again — nothing
          is charged until it succeeds.
        </p>
        <button
          className="btn btn--primary"
          onClick={retry}
          disabled={retrying}
          style={{ marginTop: 12 }}
        >
          {retrying ? "Sending…" : "Send the M-Pesa prompt again"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "12px 0" }}>
      <div className="pay-spinner" aria-hidden />
      <h2 style={{ fontSize: "1.3rem" }}>Check your phone 📲</h2>
      <p>
        We&apos;ve sent an M-Pesa request for{" "}
        <strong>KES {amount.toLocaleString()}</strong> to{" "}
        <strong>{phoneMasked}</strong>. Enter your M-Pesa PIN to confirm your
        place.
      </p>
      <p className="form-note">{note || "Waiting for confirmation…"}</p>
      <button
        className="btn-link"
        onClick={retry}
        disabled={retrying}
        style={{ marginTop: 8 }}
      >
        {retrying ? "Sending…" : "Didn't get a prompt? Resend"}
      </button>
    </div>
  );
}
