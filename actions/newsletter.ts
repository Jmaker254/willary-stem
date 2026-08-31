"use server";

import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendMail, sendNotification } from "@/lib/email";
import { type FormState, ok, fail } from "@/lib/form";
import { newsletterSchema, flattenFieldErrors } from "@/lib/validators";

export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if ((formData.get("company") as string)?.trim())
    return ok("Thanks for subscribing!");

  const ip = await clientIp();
  const rl = rateLimit(`news:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return fail(`Please wait ${rl.retryAfter}s and try again.`);

  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return fail("Please enter a valid email.", flattenFieldErrors(parsed.error));

  const { email, name, source } = parsed.data;
  const token = crypto.randomBytes(24).toString("hex");
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing?.status === "ACTIVE") {
      return ok("You're already on the list — thanks!");
    }
    const sub = await prisma.subscriber.upsert({
      where: { email },
      update: { status: "PENDING", token, name: name ?? undefined, source: source ?? undefined },
      create: { email, name: name ?? undefined, source: source ?? undefined, token, status: "PENDING" },
    });

    await sendMail(
      email,
      "Confirm your Willary STEM subscription",
      `Hi${name ? ` ${name}` : ""},\n\nConfirm your subscription:\n${base}/newsletter/confirm?token=${sub.token}\n\nIf this wasn't you, ignore this email.`,
    );
    await sendNotification(
      "New newsletter subscriber (pending)",
      `${email}${source ? ` — via ${source}` : ""}`,
    );
  } catch (err) {
    console.error("[newsletter:error]", err);
    return fail("Could not subscribe right now. Please try again later.");
  }

  return ok("Almost done — check your inbox to confirm your subscription.");
}
