"use server";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { guard, audit } from "./helpers";

export async function deleteMedia(id: string): Promise<void> {
  const u = await guard("EDITOR");
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;

  if (asset.storage === "blob" && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { del } = await import("@vercel/blob");
      await del(asset.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch (e) {
      console.error("[media:blob-del]", e);
    }
  } else if (asset.storage === "local" && asset.url.startsWith("/uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", asset.url));
    } catch {
      // file may already be gone
    }
  }

  await prisma.mediaAsset.delete({ where: { id } });
  await audit(u.id, "delete", "MediaAsset", id);
  revalidatePath("/admin/media");
}
