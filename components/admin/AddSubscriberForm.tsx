"use client";

import { useActionState } from "react";
import { addSubscriber } from "@/actions/admin/leads";
import { IDLE } from "@/lib/form";
import SubmitButton from "@/components/forms/SubmitButton";
import FormMessage from "@/components/forms/FormMessage";

export default function AddSubscriberForm() {
  const [state, action] = useActionState(addSubscriber, IDLE);
  return (
    <form action={action} className="admin-form">
      <div className="row">
        <div className="field">
          <label htmlFor="s-email">Email</label>
          <input id="s-email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="s-name">Name (optional)</label>
          <input id="s-name" name="name" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="s-tags">Tags (comma-separated, optional)</label>
        <input id="s-tags" name="tags" placeholder="sponsor, school, build-fest" />
      </div>
      <SubmitButton className="btn btn--primary btn--sm">Add subscriber</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
