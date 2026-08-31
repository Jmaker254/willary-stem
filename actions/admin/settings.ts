"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { guard, audit, ok, fail, type FormState } from "./helpers";
import { SETTING_KEYS } from "@/lib/content";

export async function saveSettings(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const u = await guard("EDITOR");

  try {
    for (const key of SETTING_KEYS) {
      const raw = formData.get(key);
      if (raw === null) continue;
      const value: string | number =
        key === "buildFestCapacity"
          ? Math.max(0, Number(raw) || 0)
          : String(raw).trim();
      await prisma.setting.upsert({
        where: { key },
        update: { value: value as never },
        create: { key, value: value as never },
      });
    }
    await audit(u.id, "update", "Setting", "*");
  } catch (e) {
    console.error("[settings:error]", e);
    return fail("Could not save settings.");
  }

  // settings affect every page
  for (const p of ["/", "/about", "/programs", "/lab", "/impact", "/events", "/build-fest", "/partner", "/contact"]) {
    revalidatePath(p);
  }
  return ok("Settings saved.");
}
