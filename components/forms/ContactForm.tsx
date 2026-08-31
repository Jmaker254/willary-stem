"use client";

import { useActionState } from "react";
import { submitContact } from "@/actions/submissions";
import { IDLE } from "@/lib/form";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";

export default function ContactForm() {
  const [state, action] = useActionState(submitContact, IDLE);
  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="form-card">
      <h2 style={{ fontSize: "1.3rem" }}>Send a message</h2>

      <div className="hp-field" aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="c-name">Full name</label>
        <input id="c-name" name="name" required />
        {fe.name && <p className="field-error">{fe.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" type="email" name="email" required />
        {fe.email && <p className="field-error">{fe.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="c-topic">I&apos;m contacting about</label>
        <input
          id="c-topic"
          name="topic"
          placeholder="School program, sponsorship, Build Fest, a build commission…"
        />
      </div>
      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" required />
        {fe.message && <p className="field-error">{fe.message}</p>}
      </div>

      <SubmitButton className="btn btn--primary btn--block">Submit</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
