"use client";

import { useActionState } from "react";
import { createUser, resetUserPassword } from "@/actions/admin/users";
import { IDLE } from "@/lib/form";
import SubmitButton from "@/components/forms/SubmitButton";
import FormMessage from "@/components/forms/FormMessage";

export function CreateUserForm() {
  const [state, action] = useActionState(createUser, IDLE);
  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};
  return (
    <form action={action} className="admin-form">
      <div className="row">
        <div className="field">
          <label htmlFor="u-name">Name</label>
          <input id="u-name" name="name" required />
          {fe.name && <p className="field-error">{fe.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="u-email">Email</label>
          <input id="u-email" name="email" type="email" required />
          {fe.email && <p className="field-error">{fe.email}</p>}
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="u-role">Role</label>
          <select id="u-role" name="role" defaultValue="EDITOR">
            <option value="ADMIN">ADMIN — full access incl. staff</option>
            <option value="EDITOR">EDITOR — leads + content</option>
            <option value="VIEWER">VIEWER — read only</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="u-pw">Temporary password (min 10 chars)</label>
          <input id="u-pw" name="password" type="text" required minLength={10} />
          {fe.password && <p className="field-error">{fe.password}</p>}
        </div>
      </div>
      <SubmitButton className="btn btn--primary btn--sm">Create user</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}

export function ResetPasswordForm({ id }: { id: string }) {
  const [state, action] = useActionState(resetUserPassword, IDLE);
  return (
    <form action={action} className="inline-actions">
      <input type="hidden" name="id" value={id} />
      <input
        name="password"
        type="text"
        placeholder="new password"
        minLength={10}
        required
        style={{ width: 160, padding: "6px 10px", fontSize: "0.85rem" }}
      />
      <button className="btn-link" type="submit">
        reset
      </button>
      {state.status !== "idle" && (
        <span
          style={{
            fontSize: "0.8rem",
            color: state.status === "ok" ? "var(--ok)" : "var(--danger)",
          }}
        >
          {state.message}
        </span>
      )}
    </form>
  );
}
