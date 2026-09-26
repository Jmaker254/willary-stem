"use server";

import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendNotification } from "@/lib/email";
import { getSettings } from "@/lib/content";
import { normalizePhone } from "@/lib/mpesa";
import type { FieldErrors } from "@/lib/form";
import {
  cohortBookingSchema,
  classPaymentSchema,
  flattenFieldErrors,
} from "@/lib/validators";
import {
  type BookingFlowState,
} from "@/lib/cohort-booking-state";

function err(message: string, fieldErrors?: FieldErrors): BookingFlowState {
  return { status: "error", message, fieldErrors };
}

function shortRef(id: string): string {
  return `CLS-${id.slice(-6).toUpperCase()}`;
}

export async function bookCohort(
  _prev: BookingFlowState,
  formData: FormData,
): Promise<BookingFlowState> {
  // Honeypot — pretend it worked.
  if ((formData.get("company") as string)?.trim())
    return {
      status: "booked_free",
      message: "Thanks — your booking request has been received.",
    };

  const ip = await clientIp();
  const rl = rateLimit(`cohort:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return err(`Too many attempts. Try again in ${rl.retryAfter}s.`);

  const parsed = cohortBookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return err(
      "Please check the highlighted fields.",
      flattenFieldErrors(parsed.error),
    );

  const d = parsed.data;

  const phone = normalizePhone(d.phone);
  if (!phone)
    return err("Please check the highlighted fields.", {
      phone: "Enter a valid Safaricom number, e.g. 0796 815 446",
    });

  try {
    const cohort = await prisma.cohort.findUnique({ where: { id: d.cohortId } });
    if (!cohort || !cohort.published || cohort.status === "CLOSED") {
      return err("That class is no longer taking bookings. Please pick another.");
    }

    let waitlist = cohort.status === "FULL";
    if (!waitlist && cohort.capacity) {
      const taken = await prisma.cohortBooking.count({
        where: {
          cohortId: cohort.id,
          status: {
            in: ["NEW", "AWAITING_PAYMENT", "PENDING_CONFIRMATION", "CONFIRMED"],
          },
        },
      });
      if (taken >= cohort.capacity) waitlist = true;
    }

    const isPaid = cohort.priceAmountKes > 0 && !waitlist;
    const status = waitlist
      ? "WAITLIST"
      : isPaid
        ? "AWAITING_PAYMENT"
        : "NEW";
    const publicRef = crypto.randomBytes(12).toString("hex");

    const row = await prisma.cohortBooking.create({
      data: {
        cohortId: cohort.id,
        name: d.name,
        email: d.email,
        phone,
        learnerName: d.learnerName ?? null,
        learnerAge: d.learnerAge ?? null,
        notes: d.notes ?? null,
        status,
        publicRef,
      },
    });

    const ref = shortRef(row.id);
    await sendNotification(
      `Class booking — ${cohort.title} — ${row.name}`,
      `${row.name} <${row.email}> · ${phone}\n` +
        `Class: ${cohort.title} (${cohort.mode})\n` +
        `${row.learnerName ? `Learner: ${row.learnerName}${row.learnerAge ? `, ${row.learnerAge}` : ""}\n` : ""}` +
        `Reference: ${ref}\n` +
        `Status: ${status}` +
        (isPaid ? ` — awaiting M-Pesa payment of KES ${cohort.priceAmountKes}` : "") +
        `\n${row.notes ? `\n${row.notes}\n` : ""}` +
        `\nOpen in admin: /admin/cohort-bookings/${row.id}`,
    );

    if (waitlist)
      return {
        status: "waitlisted",
        message:
          "That class is full — you're on the waitlist and we'll be in touch if a place opens.",
      };

    if (!isPaid)
      return {
        status: "booked_free",
        message:
          "Booking received! We'll confirm your place and any details by email.",
      };

    const settings = await getSettings();
    return {
      status: "pay",
      publicRef,
      ref,
      amountKes: cohort.priceAmountKes,
      payInfo: settings.classPayInfo,
      cohortTitle: cohort.title,
    };
  } catch (e) {
    console.error("[cohort-booking:error]", e);
    return err("Could not complete the booking. Please try again later.");
  }
}

export async function submitClassPayment(
  _prev: BookingFlowState,
  formData: FormData,
): Promise<BookingFlowState> {
  const ip = await clientIp();
  const rl = rateLimit(`classpay:${ip}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok) return err(`Too many attempts. Try again in ${rl.retryAfter}s.`);

  const parsed = classPaymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return err(
      "Please check the highlighted fields.",
      flattenFieldErrors(parsed.error),
    );

  const d = parsed.data;

  try {
    const booking = await prisma.cohortBooking.findUnique({
      where: { publicRef: d.publicRef },
      include: { cohort: true },
    });
    if (!booking) return err("We couldn't find that booking. Please start again.");
    if (
      booking.status !== "AWAITING_PAYMENT" &&
      booking.status !== "REJECTED"
    ) {
      return {
        status: "submitted",
        publicRef: d.publicRef,
        message:
          "We've already received your payment details — we're checking them now.",
      };
    }

    await prisma.cohortBooking.update({
      where: { id: booking.id },
      data: {
        status: "PENDING_CONFIRMATION",
        mpesaCode: d.mpesaCode.toUpperCase(),
        amountClaimedKes: d.amount,
        paymentClaimedAt: new Date(),
      },
    });

    const ref = shortRef(booking.id);
    const expected = booking.cohort.priceAmountKes;
    await sendNotification(
      `Class payment claimed — ${booking.cohort.title} — ${booking.name}`,
      `${booking.name} <${booking.email}> · ${booking.phone ?? ""}\n` +
        `Class: ${booking.cohort.title}\n` +
        `Reference: ${ref}\n` +
        `M-Pesa code: ${d.mpesaCode.toUpperCase()}\n` +
        `Amount claimed: KES ${d.amount}${expected && d.amount !== expected ? ` (expected KES ${expected})` : ""}\n` +
        `\nConfirm in admin: /admin/cohort-bookings/${booking.id}`,
    );

    return {
      status: "submitted",
      publicRef: d.publicRef,
      message:
        "Thanks — we're checking your payment, usually within 2 hours. We'll email you once it's confirmed.",
    };
  } catch (e) {
    console.error("[class-payment:error]", e);
    return err("Could not record your payment. Please try again later.");
  }
}
