import type { FieldErrors } from "./form";

/**
 * Shared state shape for the BuildFest registration action. Kept out of the
 * "use server" module because such files may only export async functions.
 */
export type RegisterState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: FieldErrors }
  | { status: "waitlisted"; message: string }
  | {
      status: "prompt";
      message: string;
      publicRef: string;
      amount: number;
      phoneMasked: string;
      paid?: boolean;
    };

export const REGISTER_IDLE: RegisterState = { status: "idle" };
