"use client";

import { useEffect, useState } from "react";

/**
 * Full-bleed auto-crossfading background for the home hero. Purely
 * decorative (no controls) — cycles through 1–4 images set at /admin/images.
 */
export default function HeroBgSlides({
  images,
  interval = 5500,
}: {
  images: string[];
  interval?: number;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((c) => (c + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  return (
    <div className="hero-bg-slides" aria-hidden>
      {images.map((src, idx) => (
        <div
          key={`${idx}-${src}`}
          className={`hero-bg-slide${idx === i ? " is-active" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="hero-bg-overlay" />
    </div>
  );
}
