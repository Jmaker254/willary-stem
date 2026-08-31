"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { isVideoUrl } from "@/lib/media";
import LightboxOverlay from "./LightboxOverlay";

/**
 * Auto-playing crossfade photo slideshow for past events. Click a slide to
 * open the full-screen lightbox. Falls back to labelled placeholder slides
 * when no photos are set yet.
 */
export default function Slideshow({
  photos,
  label,
  interval = 4000,
  limit = 8,
  albumUrl,
}: {
  photos: string[];
  label: string;
  interval?: number;
  limit?: number;
  albumUrl?: string | null;
}) {
  const capped = photos.slice(0, limit);
  const slides =
    capped.length > 0
      ? capped.map((src, i) => ({ src, key: `${i}-${src}` }))
      : [0, 1, 2].map((i) => ({ src: "", key: `ph-${i}` }));
  const hasPhotos = capped.length > 0;

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = slides.length;

  const go = useCallback(
    (n: number) => setIdx(((n % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setInterval(() => setIdx((c) => (c + 1) % count), interval);
    return () => clearInterval(t);
  }, [paused, count, interval]);

  return (
    <div
      className="slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label} photos`}
    >
      <div className="slideshow-track">
        {slides.map((s, i) => (
          <figure
            key={s.key}
            className={`slide${i === idx ? " is-active" : ""}${
              hasPhotos ? " is-clickable" : ""
            }`}
            aria-hidden={i !== idx}
            onClick={() => hasPhotos && setLightbox(i)}
          >
            {!s.src ? (
              <span className="slide-placeholder">{label} — add photos</span>
            ) : isVideoUrl(s.src) ? (
              <video
                src={s.src}
                muted
                loop
                playsInline
                autoPlay={i === idx}
                controls
              />
            ) : (
              <Image
                src={s.src}
                alt={`${label} — photo ${i + 1}`}
                fill
                sizes="(max-width: 720px) 100vw, 560px"
                style={{ objectFit: "cover" }}
                priority={i === 0}
              />
            )}
          </figure>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            className="slideshow-arrow is-prev"
            onClick={() => go(idx - 1)}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="slideshow-arrow is-next"
            onClick={() => go(idx + 1)}
            aria-label="Next photo"
          >
            ›
          </button>
          <div className="slideshow-dots">
            {slides.map((s, i) => (
              <button
                key={s.key}
                className={`dot${i === idx ? " is-active" : ""}`}
                onClick={() => setIdx(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === idx}
              />
            ))}
          </div>
        </>
      )}

      {hasPhotos && (
        <div className="slideshow-more">
          <button type="button" onClick={() => setLightbox(0)}>
            Expand ({photos.length})
          </button>
          {albumUrl && (
            <a href={albumUrl} target="_blank" rel="noopener noreferrer">
              Full album →
            </a>
          )}
        </div>
      )}

      <LightboxOverlay
        items={photos}
        index={lightbox}
        onIndex={setLightbox}
        onClose={() => setLightbox(null)}
        label={label}
      />
    </div>
  );
}
