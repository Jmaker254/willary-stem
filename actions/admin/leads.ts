"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { guard, audit, ok, fail, type FormState } from "./helpers";
import {
  SubmissionStatus,
  RegistrationStatus,
  SubscriberStatus,
  BookingStatus,
} from "@prisma/client";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.willaryrobotics.com";

export async function setSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<void> {
  const u = await guard("EDITOR");
  await prisma.submission.update({ where: { id }, data: { status } });
  await audit(u.id, `status:${status}`, "Submission", id);
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/admin");
}

export async function setRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<void> {
  const u = await guard("EDITOR");
  await prisma.eventRegistration.update({ where: { id }, data: { status } });
  await audit(u.id, `status:${status}`, "EventRegistration", id);
  revalidatePath("/admin/registrations");
  revalidatePath("/admin");
}

const BOOKING_STATUSES = new Set(Object.values(BookingStatus));

/** Bound to a <select name="status"> + hidden id in a single form — the "move to" dropdown. */
export async function moveCohortBookingStatus(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !BOOKING_STATUSES.has(status as BookingStatus)) return;
  const u = await guard("EDITOR");
  await prisma.cohortBooking.update({
    where: { id },
    data: { status: status as BookingStatus },
  });
  await audit(u.id, `status:${status}`, "CohortBooking", id);
  revalidatePath("/admin/cohort-bookings");
  revalidatePath(`/admin/cohort-bookings/${id}`);
  revalidatePath("/admin");
}

/** A one-off custom email to a booking's contact, sent from the admin detail page. */
export async function sendBookingEmail(
  id: string,
  formData: FormData,
): Promise<void> {
  const u = await guard("EDITOR");
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!subject || !message) return;

  const row = await prisma.cohortBooking.findUnique({ where: { id } });
  if (!row) return;

  await sendMail(row.email, subject, message);
  await audit(u.id, "send-email", "CohortBooking", id);
  revalidatePath(`/admin/cohort-bookings/${id}`);
  redirect(`/admin/cohort-bookings/${id}?emailed=1`);
}

export async function deleteCohortBooking(id: string): Promise<void> {
  const u = await guard("EDITOR");
  await prisma.cohortBooking.delete({ where: { id } });
  await audit(u.id, "delete", "CohortBooking", id);
  revalidatePath("/admin/cohort-bookings");
  redirect("/admin/cohort-bookings");
}

function revalidateBooking(id: string, publicRef: string | null) {
  revalidatePath("/admin/cohort-bookings");
  revalidatePath(`/admin/cohort-bookings/${id}`);
  revalidatePath("/admin");
  revalidatePath("/programs");
  if (publicRef) revalidatePath(`/booking/${publicRef}`);
}

export async function confirmClassPayment(id: string): Promise<void> {
  const u = await guard("EDITOR");
  const row = await prisma.cohortBooking.update({
    where: { id },
    data: { status: "CONFIRMED", confirmedAt: new Date() },
    include: { cohort: true },
  });
  await audit(u.id, "confirm-payment", "CohortBooking", id);

  const ref = `CLS-${row.id.slice(-6).toUpperCase()}`;
  await sendMail(
    row.email,
    `Payment confirmed — ${row.cohort.title}`,
    `Hi ${row.name},\n\n` +
      `Your payment is confirmed and your place in "${row.cohort.title}" is booked.\n\n` +
      `  ${row.cohort.startText}\n` +
      `  ${row.cohort.scheduleText}\n` +
      `${row.cohort.location ? `  ${row.cohort.location}\n` : ""}` +
      `\nBooking reference: ${ref}\n` +
      `Status page: ${SITE_URL}/booking/${row.publicRef ?? ""}\n` +
      `${row.cohort.whatsappGroupUrl ? `\nJoin the class WhatsApp group: ${row.cohort.whatsappGroupUrl}\n` : ""}` +
      `\nWe'll send joining details before the start date.\n\n— Willary STEM`,
  );

  revalidateBooking(id, row.publicRef);
}

export async function rejectClassPayment(id: string): Promise<void> {
  const u = await guard("EDITOR");
  const row = await prisma.cohortBooking.update({
    where: { id },
    data: { status: "REJECTED" },
    include: { cohort: true },
  });
  await audit(u.id, "reject-payment", "CohortBooking", id);

  const ref = `CLS-${row.id.slice(-6).toUpperCase()}`;
  await sendMail(
    row.email,
    `We couldn't confirm your payment — ${row.cohort.title}`,
    `Hi ${row.name},\n\n` +
      `We weren't able to match the M-Pesa details you sent for "${row.cohort.title}" ` +
      `to a payment on our statement.\n\n` +
      `Please reply to this email with your full M-Pesa confirmation message and ` +
      `your reference (${ref}) and we'll sort it out.\n\n— Willary STEM`,
  );

  revalidateBooking(id, row.publicRef);
}

export async function setSubscriberStatus(
  id: string,
  status: SubscriberStatus,
): Promise<void> {
  const u = await guard("EDITOR");
  const data =
    status === "UNSUBSCRIBED"
      ? { status, unsubscribedAt: new Date() }
      : status === "ACTIVE"
        ? { status, confirmedAt: new Date() }
        : { status };
  await prisma.subscriber.update({ where: { id }, data });
  await audit(u.id, `status:${status}`, "Subscriber", id);
  revalidatePath("/admin/subscribers");
  revalidatePath("/admin");
}

export async function addSubscriber(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Enter a valid email.");

  try {
    await prisma.subscriber.upsert({
      where: { email },
      update: { name: name ?? undefined, tags, status: "ACTIVE", confirmedAt: new Date() },
      create: {
        email,
        name: name ?? undefined,
        tags,
        source: "admin",
        status: "ACTIVE",
        confirmedAt: new Date(),
        token: crypto.randomBytes(24).toString("hex"),
      },
    });
  } catch (e) {
    console.error(e);
    return fail("Could not add subscriber.");
  }
  revalidatePath("/admin/subscribers");
  return ok(`${email} added.`);
}

export async function deleteSubscriber(id: string): Promise<void> {
  await guard("EDITOR");
  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}
