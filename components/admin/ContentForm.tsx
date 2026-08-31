"use client";

import { useActionState } from "react";
import Link from "next/link";
import { IDLE, type FormState } from "@/lib/form";
import SubmitButton from "@/components/forms/SubmitButton";
import FormMessage from "@/components/forms/FormMessage";
import { MediaPicker, MediaListPicker } from "@/components/admin/MediaPicker";

export type Field =
  | { name: string; label: string; type: "text" | "url" | "number"; hint?: string; required?: boolean }
  | { name: string; label: string; type: "textarea"; hint?: string; required?: boolean; rows?: number }
  | { name: string; label: string; type: "select"; options: string[]; hint?: string }
  | { name: string; label: string; type: "checkbox"; hint?: string }
  | { name: string; label: string; type: "list"; hint?: string }
  | { name: string; label: string; type: "media" | "media-list"; hint?: string };

type Values = Record<string, unknown>;

export default function ContentForm({
  action,
  fields,
  values = {},
  backHref,
  title,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  fields: Field[];
  values?: Values;
  backHref: string;
  title: string;
}) {
  const [state, formAction] = useActionState(action, IDLE);
  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};
  const v = (name: string) => values[name];
  const asStr = (name: string) => {
    const val = v(name);
    if (Array.isArray(val)) return (val as string[]).join("\n");
    return val === undefined || val === null ? "" : String(val);
  };

  return (
    <form action={formAction} className="admin-form panel">
      <h2>{title}</h2>
      {fields.map((f) => {
        const err = fe[f.name];

        if (f.type === "checkbox") {
          return (
            <div className="field" key={f.name}>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  name={f.name}
                  defaultChecked={Boolean(v(f.name))}
                  style={{ width: "auto" }}
                />
                {f.label}
              </label>
              {f.hint && <p className="hint">{f.hint}</p>}
            </div>
          );
        }

        if (f.type === "media" || f.type === "media-list") {
          return (
            <div className="field" key={f.name}>
              <label>{f.label}</label>
              {f.type === "media" ? (
                <MediaPicker name={f.name} defaultValue={asStr(f.name)} />
              ) : (
                <MediaListPicker name={f.name} defaultValue={asStr(f.name)} />
              )}
              {f.hint && <p className="hint">{f.hint}</p>}
              {err && <p className="field-error">{err}</p>}
            </div>
          );
        }

        return (
          <div className="field" key={f.name}>
            <label htmlFor={`f-${f.name}`}>{f.label}</label>
            {f.type === "textarea" || f.type === "list" ? (
              <textarea
                id={`f-${f.name}`}
                name={f.name}
                rows={f.type === "list" ? 3 : (f.type === "textarea" && f.rows) || 6}
                defaultValue={asStr(f.name)}
              />
            ) : f.type === "select" ? (
              <select
                id={`f-${f.name}`}
                name={f.name}
                defaultValue={(v(f.name) as string) ?? f.options[0]}
              >
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`f-${f.name}`}
                name={f.name}
                type={f.type === "number" ? "number" : "text"}
                defaultValue={asStr(f.name)}
              />
            )}
            {f.hint && <p className="hint">{f.hint}</p>}
            {err && <p className="field-error">{err}</p>}
          </div>
        );
      })}

      <div className="inline-actions" style={{ marginTop: 8 }}>
        <SubmitButton className="btn btn--primary">Save</SubmitButton>
        <Link className="btn btn--ghost" href={backHref}>
          Cancel
        </Link>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
