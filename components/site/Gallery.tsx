"use client";

import { useState } from "react";
import Image from "next/image";
import { isVideoUrl } from "@/lib/media";
import LightboxOverlay from "./LightboxOverlay";

/**
 * Thumbnail grid that expands to a full-screen lightbox on click.
 * Shows up to `limit` thumbnails; a footer lets you open the full set
 * (in the lightbox) or jump to an external album.
 */
export default function Gallery({
  media,
  albumUrl,
  limit = 6,
  label = "Photo",
  moreLabel = "See more photos",
}: {
  media: string[];
  albumUrl?: string | null;
  limit?: number;
  label?: string;
  moreLabel?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const shown = media.slice(0, limit);
  const extra = Math.max(0, media.length - limit);

  if (media.length === 0) {
    return (
      <div className="gallery">
        {Array.from({ length: limit }).map((_, i) => (
          <div className="media" key={i}>
            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="gallery">
        {shown.map((src, i) => (
          <button
            type="button"
            className="media media-clickable"
            key={`${i}-${src}`}
            onClick={() => setIndex(i)}
            aria-label={`Open ${label} ${i + 1}`}
          >
            {isVideoUrl(src) ? (
              <video src={src} muted playsInline />
            ) : (
              <Image
                src={src}
                alt={`${label} ${i + 1}`}
                fill
                sizes="(max-width: 520px) 50vw, (max-width: 960px) 33vw, 260px"
                style={{ objectFit: "cover" }}
              />
            )}
            {i === shown.length - 1 && extra > 0 && (
              <span className="media-more-badge">+{extra}</span>
            )}
          </button>
        ))}
      </div>

      <p style={{ textAlign: "center", marginTop: 28 }}>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setIndex(0)}
        >
          View gallery ({media.length})
        </button>
        {albumUrl && (
          <a
            className="btn btn--ghost"
            href={albumUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 10 }}
          >
            {moreLabel} →
          </a>
        )}
      </p>

      <LightboxOverlay
        items={media}
        index={index}
        onIndex={setIndex}
        onClose={() => setIndex(null)}
        label={label}
      />
    </>
  );
}
