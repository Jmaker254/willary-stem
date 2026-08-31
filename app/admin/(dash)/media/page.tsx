import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import MediaLibrary, { type Asset } from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireUser("EDITOR");
  const rows = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const assets: Asset[] = rows.map((r) => ({
    id: r.id,
    url: r.url,
    type: r.type,
    filename: r.filename,
    size: r.size,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
      <h1>Media library</h1>
      <p style={{ color: "var(--body)", marginTop: -8 }}>
        Upload photos and videos here, then paste their URL into a project,
        event, or the logo field — or upload directly from those forms.
      </p>
      <MediaLibrary assets={assets} />
    </>
  );
}
