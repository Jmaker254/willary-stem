import { NextRequest, NextResponse } from "next/server";
import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { store } from "@/lib/upload";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// allow larger request bodies for video uploads (local dev)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!hasRole(user, "EDITOR")) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not read the upload — the file may be too large or the connection dropped. Try a smaller file.",
      },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const stored = await store(file);
    const asset = await prisma.mediaAsset.create({
      data: {
        url: stored.url,
        type: stored.type,
        filename: stored.filename,
        mimeType: stored.mimeType,
        size: stored.size,
        storage: stored.storage,
        uploadedById: user!.id,
      },
    });
    await audit(user!.id, "upload", "MediaAsset", asset.id);
    return NextResponse.json({
      id: asset.id,
      url: asset.url,
      type: asset.type,
      filename: asset.filename,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload:error]", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
