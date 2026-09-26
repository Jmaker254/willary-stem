import type { FieldErrors } from "./form";

/**
 * State shape for the shop checkout action. Kept out of the "use server"
 * module because such files may only export async functions.
 */
export type OrderState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: FieldErrors }
  | { status: "done"; ref: string; subtotalKes: number; email: string };

export const ORDER_IDLE: OrderState = { status: "idle" };
