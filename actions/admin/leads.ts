"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { guard, audit, ok, fail, type FormState } from "./helpers";
import {
  SubmissionStatus,
  RegistrationStatus,
  SubscriberStatus,
  BookingStatus,
} from "@prisma/client";

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

export async function setCohortBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<void> {
  const u = await guard("EDITOR");
  await prisma.cohortBooking.update({ where: { id }, data: { status } });
  await audit(u.id, `status:${status}`, "CohortBooking", id);
  revalidatePath("/admin/cohort-bookings");
  revalidatePath("/admin");
}

export async function deleteCohortBooking(id: string): Promise<void> {
  const u = await guard("EDITOR");
  await prisma.cohortBooking.delete({ where: { id } });
  await audit(u.id, "delete", "CohortBooking", id);
  revalidatePath("/admin/cohort-bookings");
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
