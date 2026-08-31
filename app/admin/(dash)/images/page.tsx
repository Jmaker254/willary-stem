import { requireUser } from "@/lib/auth";
import { getPageImages } from "@/lib/content";
import PageImagesForm from "@/components/admin/PageImagesForm";

export const dynamic = "force-dynamic";

export default async function PageImagesPage() {
  await requireUser("EDITOR");
  const images = await getPageImages();

  return (
    <>
      <h1>Page images</h1>
      <p style={{ color: "var(--body)", marginTop: -8 }}>
        The fixed images on otherwise-static pages (hero shots, the founder
        photo, section backgrounds). Upload or paste a URL for each slot. Empty
        slots fall back to a labelled placeholder.
      </p>
      <PageImagesForm images={images} />
    </>
  );
}
