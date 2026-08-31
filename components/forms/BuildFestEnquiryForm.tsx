"use client";

import { useActionState } from "react";
import { submitBuildFestEnquiry } from "@/actions/submissions";
import { IDLE } from "@/lib/form";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";

export default function BuildFestEnquiryForm() {
  const [state, action] = useActionState(submitBuildFestEnquiry, IDLE);
  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="form-card">
      <h2 style={{ fontSize: "1.3rem" }}>Willary BuildFest 2026 enquiry</h2>

      <div className="hp-field" aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="bf-name">Full name</label>
        <input id="bf-name" name="name" required />
        {fe.name && <p className="field-error">{fe.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="bf-email">Email</label>
        <input id="bf-email" type="email" name="email" required />
        {fe.email && <p className="field-error">{fe.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="bf-org">Organisation (optional)</label>
        <input id="bf-org" name="organisation" />
      </div>
      <div className="field">
        <label htmlFor="bf-topic">I&apos;m interested in</label>
        <select id="bf-topic" name="topic" defaultValue="Attending">
          <option>Attending</option>
          <option>Competing / entering a track</option>
          <option>Exhibiting</option>
          <option>Sponsoring</option>
          <option>Volunteering / judging</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="bf-message">Message</label>
        <textarea id="bf-message" name="message" required />
        {fe.message && <p className="field-error">{fe.message}</p>}
      </div>

      <SubmitButton className="btn btn--primary btn--block">
        Send enquiry
      </SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
