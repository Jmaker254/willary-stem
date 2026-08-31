"use server";

import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendNotification } from "@/lib/email";
import { headers } from "next/headers";
import { type FormState, ok, fail } from "@/lib/form";
import {
  contactSchema,
  partnerSchema,
  buildFestEnquirySchema,
  flattenFieldErrors,
} from "@/lib/validators";
import type { SubmissionType } from "@prisma/client";
import { z } from "zod";

const THANKS = "Thanks — your message has been received. We'll reply soon.";

async function handle<T extends z.ZodTypeAny>(
  schema: T,
  type: SubmissionType,
  formData: FormData,
): Promise<FormState> {
  // Honeypot: real users never fill this.
  if ((formData.get("company") as string)?.trim()) return ok(THANKS);

  const ip = await clientIp();
  const rl = rateLimit(`submit:${ip}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok) return fail(`Too many messages. Try again in ${rl.retryAfter}s.`);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return fail("Please check the highlighted fields.", flattenFieldErrors(parsed.error));
  }
  const data = parsed.data as Record<string, string | undefined>;

  const ua = (await headers()).get("user-agent") ?? undefined;

  try {
    const row = await prisma.submission.create({
      data: {
        type,
        name: data.name!,
        email: data.email!,
        organisation: data.organisation ?? null,
        topic: data.topic ?? null,
        message: data.message!,
        ip,
        userAgent: ua,
      },
    });
    const lines = [
      `${row.name} <${row.email}>`,
      row.organisation ? `Org: ${row.organisation}` : null,
      row.topic ? `Topic: ${row.topic}` : null,
      "",
      row.message,
      "",
      `Open in admin: /admin/submissions/${row.id}`,
    ].filter((l) => l !== null);
    await sendNotification(`New ${type} submission — ${row.name}`, lines.join("\n"));
  } catch (err) {
    console.error("[submission:error]", err);
    return fail("Something went wrong saving your message. Please try again.");
  }

  return ok(THANKS);
}

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return handle(contactSchema, "CONTACT", formData);
}

export async function submitPartner(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return handle(partnerSchema, "PARTNER", formData);
}

export async function submitBuildFestEnquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return handle(buildFestEnquirySchema, "BUILDFEST_ENQUIRY", formData);
}
