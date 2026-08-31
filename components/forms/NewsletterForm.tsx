"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/actions/newsletter";
import { IDLE } from "@/lib/form";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";

export default function NewsletterForm({
  source = "site",
  compact = true,
}: {
  source?: string;
  compact?: boolean;
}) {
  const [state, action] = useActionState(subscribeNewsletter, IDLE);

  return (
    <form action={action} className={compact ? "" : "form-card"}>
      <input type="hidden" name="source" value={source} />
      <div className="hp-field" aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div style={{ display: "flex", gap: 12, maxWidth: 480, flexWrap: "wrap" }}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          aria-label="Email address"
          style={{
            flex: 1,
            minWidth: 220,
            padding: "13px 18px",
            borderRadius: 999,
            border: "1px solid var(--line)",
            fontSize: "0.95rem",
          }}
        />
        <SubmitButton pendingText="Subscribing…">Subscribe</SubmitButton>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
