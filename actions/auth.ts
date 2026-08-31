"use server";

import { redirect } from "next/navigation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { authenticate, createSession, destroySession } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { loginSchema } from "@/lib/validators";
import { type FormState, fail } from "@/lib/form";

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ip = await clientIp();
  const rl = rateLimit(`login:${ip}`, { limit: 8, windowMs: 5 * 60_000 });
  if (!rl.ok)
    return fail(`Too many attempts. Try again in ${Math.ceil(rl.retryAfter / 60)} min.`);

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Enter your email and password.");

  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return fail("Wrong email or password.");

  await createSession(user);
  await audit(user.id, "login", "User", user.id);

  const next = (formData.get("next") as string) || "/admin";
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
