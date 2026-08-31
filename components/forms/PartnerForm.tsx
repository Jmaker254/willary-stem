"use client";

import { useActionState } from "react";
import { submitPartner } from "@/actions/submissions";
import { IDLE } from "@/lib/form";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";

export default function PartnerForm() {
  const [state, action] = useActionState(submitPartner, IDLE);
  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="form-card">
      <h2 style={{ fontSize: "1.3rem" }}>Partnership enquiry</h2>

      <div className="hp-field" aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="p-org">Organisation</label>
        <input id="p-org" name="organisation" required />
        {fe.organisation && <p className="field-error">{fe.organisation}</p>}
      </div>
      <div className="field">
        <label htmlFor="p-name">Contact name</label>
        <input id="p-name" name="name" required />
        {fe.name && <p className="field-error">{fe.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="p-email">Email</label>
        <input id="p-email" type="email" name="email" required />
        {fe.email && <p className="field-error">{fe.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="p-interest">Area of interest</label>
        <input
          id="p-interest"
          name="topic"
          placeholder="e.g. Build Fest Gold sponsorship, school program, community visits"
        />
      </div>
      <div className="field">
        <label htmlFor="p-message">Message</label>
        <textarea id="p-message" name="message" required />
        {fe.message && <p className="field-error">{fe.message}</p>}
      </div>

      <SubmitButton className="btn btn--primary btn--block">
        Send enquiry
      </SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
