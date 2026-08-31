"use server";

import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendNotification } from "@/lib/email";
import {
  registrationSchema,
  flattenFieldErrors,
  isTeamTicket,
  TEAM_LIMITS,
} from "@/lib/validators";
import {
  mpesaConfigured,
  devBypass,
  normalizePhone,
  stkPush,
} from "@/lib/mpesa";
import { getSettings } from "@/lib/content";
import type { RegisterState } from "@/lib/register-state";

const EVENT = "BUILD_FEST_2026";

function maskPhone(p: string): string {
  return p.length >= 8 ? `${p.slice(0, 6)}***${p.slice(-2)}` : p;
}

async function ticketPrice(): Promise<number> {
  const s = await getSettings();
  const n = Number(s.buildFestTicketKes);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 500;
}

export async function registerForBuildFest(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  if ((formData.get("company") as string)?.trim())
    return { status: "waitlisted", message: "Thanks — your registration has been received." };

  const ip = await clientIp();
  const rl = rateLimit(`reg:${ip}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok)
    return { status: "error", message: `Too many attempts. Try again in ${rl.retryAfter}s.` };

  const parsed = registrationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: flattenFieldErrors(parsed.error),
    };

  const d = parsed.data;
  if (Number.isNaN(d.teamSize))
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { teamSize: "Enter a valid team size" },
    };

  // --- Team roster & size ---
  const memberNames = formData
    .getAll("member")
    .map((v) => String(v).trim())
    .filter(Boolean)
    .slice(0, 50);

  let teamSize = 1;
  if (isTeamTicket(d.ticketType)) {
    const lim = TEAM_LIMITS[d.ticketType];
    const requested = d.teamSize ?? memberNames.length ?? 1;
    if (requested < lim.min || requested > lim.max) {
      return {
        status: "error",
        message: `A ${d.ticketType === "TEAM" ? "Main Challenge team" : "Junior Builder team"} is ${lim.min}–${lim.max} people.`,
        fieldErrors: { teamSize: `Enter a number between ${lim.min} and ${lim.max}` },
      };
    }
    teamSize = requested;
    if (memberNames.length !== teamSize) {
      return {
        status: "error",
        message: `List all ${teamSize} team member names.`,
        fieldErrors: {
          members: `You entered ${memberNames.length} of ${teamSize} names.`,
        },
      };
    }
  }

  const phone = normalizePhone(d.phone);
  if (!phone)
    return {
      status: "error",
      message: "Enter a valid Safaricom number.",
      fieldErrors: { phone: "Use 07XX XXX XXX or 2547XXXXXXXX" },
    };

  const price = await ticketPrice();

  try {
    const cap = Number(
      (await prisma.setting.findUnique({ where: { key: "buildFestCapacity" } }))?.value ?? 300,
    );
    const agg = await prisma.eventRegistration.aggregate({
      where: { event: EVENT, status: { in: ["PENDING", "CONFIRMED"] } },
      _sum: { quantity: true },
    });
    const taken = agg._sum.quantity ?? 0;
    const isTeam = isTeamTicket(d.ticketType);
    const qty = isTeam ? teamSize : 1;
    const members = isTeam ? memberNames : [d.name];
    const amount = qty * price; // KES 500 × number of people
    const atCapacity = taken + qty > cap;

    const row = await prisma.eventRegistration.create({
      data: {
        event: EVENT,
        ticketType: d.ticketType,
        name: d.name,
        email: d.email,
        phone,
        organisation: d.organisation ?? null,
        teamName: d.teamName ?? null,
        teamSize: isTeam ? teamSize : null,
        members,
        trackInterest: d.trackInterest ?? null,
        quantity: qty,
        amount,
        notes: d.notes ?? null,
        status: atCapacity ? "WAITLIST" : "PENDING",
      },
    });

    if (atCapacity) {
      await sendNotification(
        `BuildFest waitlist — ${row.name}`,
        `${row.name} <${row.email}> — ${row.ticketType}, qty ${qty}. Not charged.`,
      );
      return {
        status: "waitlisted",
        message:
          "We're at capacity — you're on the waitlist and won't be charged. We'll be in touch if a place opens up.",
      };
    }

    const publicRef = crypto.randomBytes(16).toString("hex");
    const accountRef = `BFEST-${row.id.slice(-6).toUpperCase()}`;
    const payment = await prisma.payment.create({
      data: { registrationId: row.id, amount, phone, accountRef, publicRef, status: "PENDING" },
    });

    if (devBypass()) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", mpesaReceipt: "DEV-BYPASS", resultCode: 0, resultDesc: "Dev bypass" },
        }),
        prisma.eventRegistration.update({
          where: { id: row.id },
          data: { status: "CONFIRMED", paidAt: new Date() },
        }),
      ]);
      return {
        status: "prompt",
        message: "Dev bypass — payment marked as paid.",
        publicRef,
        amount,
        phoneMasked: maskPhone(phone),
        paid: true,
      };
    }

    if (!mpesaConfigured()) {
      await sendNotification(
        `BuildFest registration — payment pending (M-Pesa not configured) — ${row.name}`,
        `${row.name} <${row.email}> — KES ${amount}. Set the Daraja env vars, then follow up for payment.`,
      );
      return {
        status: "error",
        message:
          "Online payment isn't switched on yet. Your registration is saved as pending — we'll email you M-Pesa instructions.",
      };
    }

    try {
      const stk = await stkPush({ phone, amount, accountRef, description: "BuildFest" });
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PROCESSING",
          merchantRequestId: stk.merchantRequestId,
          checkoutRequestId: stk.checkoutRequestId,
        },
      });
      await sendNotification(
        `BuildFest registration — M-Pesa prompt sent — ${row.name}`,
        `${row.name} <${row.email}> — ${row.ticketType}, qty ${qty}, KES ${amount}\nPhone ${phone}\nOpen in admin: /admin/registrations`,
      );
      return {
        status: "prompt",
        message: stk.customerMessage,
        publicRef,
        amount,
        phoneMasked: maskPhone(phone),
      };
    } catch (e) {
      console.error("[stk:error]", e);
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          resultDesc: e instanceof Error ? e.message : "STK push failed",
        },
      });
      return {
        status: "error",
        message: "We couldn't start the M-Pesa prompt. Check the number and try again.",
      };
    }
  } catch (err) {
    console.error("[registration:error]", err);
    return { status: "error", message: "Could not complete registration. Please try again later." };
  }
}
