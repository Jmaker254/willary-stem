"use server";

import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendNotification } from "@/lib/email";
import { type FormState, ok, fail } from "@/lib/form";
import { cohortBookingSchema, flattenFieldErrors } from "@/lib/validators";

export async function bookCohort(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if ((formData.get("company") as string)?.trim())
    return ok("Thanks — your booking request has been received.");

  const ip = await clientIp();
  const rl = rateLimit(`cohort:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return fail(`Too many attempts. Try again in ${rl.retryAfter}s.`);

  const parsed = cohortBookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return fail("Please check the highlighted fields.", flattenFieldErrors(parsed.error));

  const d = parsed.data;

  try {
    const cohort = await prisma.cohort.findUnique({ where: { id: d.cohortId } });
    if (!cohort || !cohort.published || cohort.status === "CLOSED") {
      return fail("That class is no longer taking bookings. Please pick another.");
    }

    let status: "NEW" | "WAITLIST" = "NEW";
    if (cohort.status === "FULL") status = "WAITLIST";
    if (cohort.capacity) {
      const taken = await prisma.cohortBooking.count({
        where: { cohortId: cohort.id, status: { in: ["NEW", "CONFIRMED"] } },
      });
      if (taken >= cohort.capacity) status = "WAITLIST";
    }

    const row = await prisma.cohortBooking.create({
      data: {
        cohortId: cohort.id,
        name: d.name,
        email: d.email,
        phone: d.phone ?? null,
        learnerName: d.learnerName ?? null,
        learnerAge: d.learnerAge ?? null,
        notes: d.notes ?? null,
        status,
      },
    });

    await sendNotification(
      `Class booking — ${cohort.title} — ${row.name}`,
      `${row.name} <${row.email}>${row.phone ? ` · ${row.phone}` : ""}\n` +
        `Class: ${cohort.title} (${cohort.mode})\n` +
        `${row.learnerName ? `Learner: ${row.learnerName}${row.learnerAge ? `, ${row.learnerAge}` : ""}\n` : ""}` +
        `Status: ${status}\n` +
        `${row.notes ? `\n${row.notes}\n` : ""}` +
        `\nOpen in admin: /admin/cohort-bookings`,
    );

    return status === "WAITLIST"
      ? ok("That class is full — you're on the waitlist and we'll be in touch if a place opens.")
      : ok("Booking received! We'll confirm your place and payment details by email.");
  } catch (err) {
    console.error("[cohort-booking:error]", err);
    return fail("Could not complete the booking. Please try again later.");
  }
}
