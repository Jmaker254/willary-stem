"use server";

import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendNotification, sendMail } from "@/lib/email";
import type { FieldErrors } from "@/lib/form";
import { orderRequestSchema, flattenFieldErrors } from "@/lib/validators";
import { type OrderState } from "@/lib/shop-state";

interface CartLineInput {
  productId?: unknown;
  quantity?: unknown;
}

function err(message: string, fieldErrors?: FieldErrors): OrderState {
  return { status: "error", message, fieldErrors };
}

function ksh(n: number): string {
  return `KES ${n.toLocaleString("en-KE")}`;
}

export async function requestOrder(
  _prev: OrderState,
  formData: FormData,
): Promise<OrderState> {
  // Honeypot — pretend it worked.
  if ((formData.get("company") as string)?.trim()) {
    return {
      status: "done",
      ref: "WS-000000",
      subtotalKes: 0,
      email: String(formData.get("email") ?? ""),
    };
  }

  const ip = await clientIp();
  const rl = rateLimit(`order:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return err(`Too many attempts. Try again in ${rl.retryAfter}s.`);

  const parsed = orderRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return err(
      "Please check the highlighted fields.",
      flattenFieldErrors(parsed.error),
    );

  const d = parsed.data;

  let rawLines: CartLineInput[];
  try {
    const p = JSON.parse(d.cart);
    rawLines = Array.isArray(p) ? p : [];
  } catch {
    return err("Your cart could not be read. Please reload and try again.");
  }

  // Collapse to productId -> quantity, trusting only ids + quantities.
  const wanted = new Map<string, number>();
  for (const l of rawLines) {
    const id = typeof l.productId === "string" ? l.productId : "";
    const qty = Math.max(1, Math.min(99, Math.trunc(Number(l.quantity) || 0)));
    if (id) wanted.set(id, (wanted.get(id) ?? 0) + qty);
  }
  if (wanted.size === 0)
    return err("Your cart is empty — add a product before checking out.");

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: [...wanted.keys()] }, published: true },
    });

    const lines = products
      .filter((p) => p.status !== "COMING_SOON")
      .map((p) => ({
        productId: p.id,
        name: p.name,
        priceKes: p.priceKes,
        quantity: wanted.get(p.id) ?? 1,
      }));

    if (lines.length === 0)
      return err(
        "None of the items in your cart are available right now. Please reload the shop.",
      );

    const subtotalKes = lines.reduce(
      (sum, l) => sum + l.priceKes * l.quantity,
      0,
    );
    const ref = `WS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        ref,
        name: d.name,
        email: d.email,
        phone: d.phone,
        address: d.address ?? null,
        notes: d.notes ?? null,
        subtotalKes,
        items: { create: lines },
      },
      include: { items: true },
    });

    const itemLines = order.items
      .map(
        (i) => `  ${i.quantity} x ${i.name} - ${ksh(i.priceKes * i.quantity)}`,
      )
      .join("\n");

    await sendNotification(
      `Shop order ${ref} - ${d.name}`,
      `${d.name} <${d.email}> - ${d.phone}\n` +
        `${d.address ? `Deliver to: ${d.address}\n` : ""}` +
        `\n${itemLines}\n\nSubtotal: ${ksh(subtotalKes)}\n` +
        `${d.notes ? `\nNote: ${d.notes}\n` : ""}` +
        `\nOpen in admin: /admin/shop-orders/${order.id}`,
    );

    await sendMail(
      d.email,
      `We've got your order ${ref}`,
      `Hi ${d.name},\n\n` +
        `Thanks for your order with Willary STEM. Here's what we received:\n\n` +
        `${itemLines}\n\nSubtotal: ${ksh(subtotalKes)}\n` +
        `Order reference: ${ref}\n\n` +
        `This is an order request - we'll confirm stock and payment details by ` +
        `email or phone shortly. Nothing has been charged yet.\n\n` +
        `- Willary STEM`,
    );

    return { status: "done", ref, subtotalKes, email: d.email };
  } catch (e) {
    console.error("[shop-order:error]", e);
    return err("Could not place the order. Please try again later.");
  }
}
