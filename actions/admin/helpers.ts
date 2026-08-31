import "server-only";
import { requireUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
import type { Role } from "@prisma/client";
import { type FormState, ok, fail } from "@/lib/form";
import { flattenFieldErrors } from "@/lib/validators";
import type { z } from "zod";

export { ok, fail, audit, requireUser };
export type { FormState };

/** Parse a FormData against a schema, returning either data or a FormState error. */
export function parseForm<T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData,
): { ok: true; data: z.infer<T> } | { ok: false; state: FormState } {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      state: fail("Please check the highlighted fields.", flattenFieldErrors(parsed.error)),
    };
  }
  return { ok: true, data: parsed.data };
}

export function splitList(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function guard(min: Role) {
  return requireUser(min);
}
