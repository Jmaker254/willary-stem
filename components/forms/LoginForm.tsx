"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { IDLE } from "@/lib/form";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(loginAction, IDLE);
  return (
    <form action={action} className="form-card login-card">
      <h1 style={{ fontSize: "1.4rem" }}>Willary STEM admin</h1>
      <p className="form-note" style={{ marginBottom: 18 }}>
        Sign in to manage leads and site content.
      </p>
      {next && <input type="hidden" name="next" value={next} />}
      <div className="field">
        <label htmlFor="l-email">Email</label>
        <input id="l-email" name="email" type="email" required autoComplete="username" />
      </div>
      <div className="field">
        <label htmlFor="l-pw">Password</label>
        <input
          id="l-pw"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <SubmitButton className="btn btn--primary btn--block" pendingText="Signing in…">
        Sign in
      </SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
