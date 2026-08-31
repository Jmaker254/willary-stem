"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { guard, audit, ok, fail, type FormState } from "./helpers";
import { userCreateSchema, flattenFieldErrors, ROLES } from "@/lib/validators";
import { Role } from "@prisma/client";

export async function createUser(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await guard("ADMIN");
  const parsed = userCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return fail("Please check the fields.", flattenFieldErrors(parsed.error));
  const { name, email, role, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return fail("A user with that email already exists.");
    const u = await prisma.user.create({
      data: { name, email, role, passwordHash: await hashPassword(password) },
    });
    await audit(admin.id, "create", "User", u.id);
  } catch (e) {
    console.error("[users:error]", e);
    return fail("Could not create the user.");
  }
  revalidatePath("/admin/users");
  return ok(`${email} added as ${role}.`);
}

export async function setUserRole(id: string, role: Role): Promise<void> {
  const admin = await guard("ADMIN");
  if (id === admin.id) return; // don't let an admin demote themselves
  if (!ROLES.includes(role)) return;
  await prisma.user.update({ where: { id }, data: { role } });
  await audit(admin.id, `role:${role}`, "User", id);
  revalidatePath("/admin/users");
}

export async function resetUserPassword(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await guard("ADMIN");
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 10) return fail("Password must be at least 10 characters.");
  await prisma.user.update({
    where: { id },
    data: { passwordHash: await hashPassword(password) },
  });
  await audit(admin.id, "password-reset", "User", id);
  revalidatePath("/admin/users");
  return ok("Password updated.");
}

export async function deleteUser(id: string): Promise<void> {
  const admin = await guard("ADMIN");
  if (id === admin.id) return;
  await prisma.user.delete({ where: { id } });
  await audit(admin.id, "delete", "User", id);
  revalidatePath("/admin/users");
}
