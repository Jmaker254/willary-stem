import type { FieldErrors } from "./form";

/**
 * State for the class-booking flow. Kept out of the "use server" module because
 * such files may only export async functions. Mirrors lib/register-state.ts.
 */
export type BookingFlowState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: FieldErrors }
  | { status: "waitlisted"; message: string }
  | { status: "booked_free"; message: string }
  | {
      status: "pay";
      publicRef: string;
      ref: string;
      amountKes: number;
      payInfo: string;
      cohortTitle: string;
    }
  | { status: "submitted"; publicRef: string; message: string };

export const BOOKING_FLOW_IDLE: BookingFlowState = { status: "idle" };
