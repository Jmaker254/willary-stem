import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_VIDEO_BYTES = 64 * 1024 * 1024; // 64 MB (local dev; see README for prod limits)

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/ogg": "ogv",
};

export interface StoredFile {
  url: string;
  storage: "local" | "blob";
  filename: string;
  mimeType: string;
  size: number;
  type: "IMAGE" | "VIDEO";
}

export function classify(mime: string): "IMAGE" | "VIDEO" | null {
  if (IMAGE_TYPES.includes(mime)) return "IMAGE";
  if (VIDEO_TYPES.includes(mime)) return "VIDEO";
  return null;
}

export function validate(file: File): { ok: true; kind: "IMAGE" | "VIDEO" } | { ok: false; error: string } {
  const kind = classify(file.type);
  if (!kind) return { ok: false, error: `Unsupported file type: ${file.type || "unknown"}` };
  const max = kind === "IMAGE" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > max) {
    return { ok: false, error: `File is too large (${(file.size / 1e6).toFixed(1)} MB). Max ${(max / 1e6).toFixed(0)} MB.` };
  }
  return { ok: true, kind };
}

/**
 * Persist an uploaded file. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set,
 * otherwise writes to /public/uploads (works in local dev only — serverless
 * filesystems are read-only, so production needs the Blob token).
 */
export async function store(file: File): Promise<StoredFile> {
  const v = validate(file);
  if (!v.ok) throw new Error(v.error);

  const ext = EXT[file.type] ?? "bin";
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, buffer, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return {
      url: blob.url,
      storage: "blob",
      filename: file.name || name,
      mimeType: file.type,
      size: file.size,
      type: v.kind,
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "File storage is not configured. Set BLOB_READ_WRITE_TOKEN to enable uploads in production.",
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return {
    url: `/uploads/${name}`,
    storage: "local",
    filename: file.name || name,
    mimeType: file.type,
    size: file.size,
    type: v.kind,
  };
}

export { isVideoUrl } from "./media";
