"use client";

import { useState } from "react";
import Image from "next/image";
import LightboxOverlay from "./LightboxOverlay";
import type { Testimonial } from "@/lib/types";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [photo, setPhoto] = useState<string | null>(null);
  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid--3">
        {items.map((t) => (
          <figure className="testimonial" key={`${t.name}-${t.order}`}>
            {t.photoUrl && (
              <button
                type="button"
                className="testimonial-photo"
                onClick={() => setPhoto(t.photoUrl!)}
                aria-label={`View photo of ${t.name}`}
              >
                <Image
                  src={t.photoUrl}
                  alt={t.name}
                  width={72}
                  height={72}
                  sizes="72px"
                />
              </button>
            )}
            <blockquote className="testimonial-quote">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="testimonial-cite">
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <LightboxOverlay
        items={photo ? [photo] : []}
        index={photo ? 0 : null}
        onIndex={() => {}}
        onClose={() => setPhoto(null)}
        label="photo"
      />
    </>
  );
}
