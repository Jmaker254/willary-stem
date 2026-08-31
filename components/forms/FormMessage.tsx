import type { FormState } from "@/lib/form";

export default function FormMessage({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  return (
    <p
      className={`form-feedback ${state.status === "ok" ? "is-ok" : "is-error"}`}
      role="status"
    >
      {state.message}
    </p>
  );
}
