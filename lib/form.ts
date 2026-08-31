export type FieldErrors = Record<string, string>;

export type FormState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string; fieldErrors?: FieldErrors };

export const IDLE: FormState = { status: "idle" };

export function ok(message: string): FormState {
  return { status: "ok", message };
}

export function fail(message: string, fieldErrors?: FieldErrors): FormState {
  return { status: "error", message, fieldErrors };
}
