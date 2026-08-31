"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect } from "react";
import { isVideoUrl } from "@/lib/media";

/**
 * Controlled full-screen media viewer. Parent owns `index` (null = closed).
 */
export default function LightboxOverlay({
  items,
  index,
  onIndex,
  onClose,
  label = "media",
}: {
  items: string[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  label?: string;
}) {
  const open = index !== null && items.length > 0;
  const count = items.length;

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      onIndex(((index + d) % count + count) % count);
    },
    [index, count, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go, onClose]);

  if (!open) return null;
  const src = items[index!];

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${label} viewer`}
      onClick={onClose}
    >
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>
        ✕
      </button>
      {count > 1 && (
        <>
          <button
            className="lightbox-nav is-prev"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            ‹
          </button>
          <button
            className="lightbox-nav is-next"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            ›
          </button>
        </>
      )}
      <figure className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        {isVideoUrl(src) ? (
          <video src={src} controls autoPlay playsInline />
        ) : (
          <img src={src} alt={`${label} ${index! + 1}`} />
        )}
      </figure>
      {count > 1 && (
        <div className="lightbox-count">
          {index! + 1} / {count}
        </div>
      )}
    </div>
  );
}
