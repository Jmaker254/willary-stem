import { isVideoUrl } from "@/lib/media";

/**
 * Dark inner-page hero banner. When `bg` is set, the content sits over a
 * full-bleed image or looping video with a readability overlay; otherwise
 * it's the plain dark band. Edit `bg` per page at /admin/images.
 */
export default function PageHero({
  bg,
  children,
}: {
  bg?: string | null;
  children: React.ReactNode;
}) {
  const hasBg = Boolean(bg);
  return (
    <section className={`page-hero${hasBg ? " has-bg" : ""}`}>
      {hasBg &&
        (isVideoUrl(bg!) ? (
          <video
            className="page-hero-media"
            src={bg!}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div
            className="page-hero-media"
            style={{ backgroundImage: `url(${bg})` }}
            aria-hidden
          />
        ))}
      {hasBg && <div className="page-hero-overlay" aria-hidden />}
      <div className="container">{children}</div>
    </section>
  );
}
