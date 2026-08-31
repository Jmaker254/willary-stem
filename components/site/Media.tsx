import type { CSSProperties } from "react";
import Image from "next/image";

/**
 * Image slot. Renders an optimised <Image> when `src` is set, otherwise a
 * labelled placeholder block (same treatment as the design mockups).
 */
export default function Media({
  src,
  alt,
  label,
  variant,
  className,
  style,
  priority = false,
}: {
  src?: string | null;
  alt?: string;
  label?: string;
  variant?: "tall" | "wide";
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  const cls = [
    "media",
    variant === "tall" ? "media--tall" : "",
    variant === "wide" ? "media--wide" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} style={style}>
      {src ? (
        <Image
          src={src}
          alt={alt ?? label ?? ""}
          fill
          sizes="(max-width: 720px) 100vw, 560px"
          style={{ objectFit: "cover" }}
          priority={priority}
        />
      ) : (
        <span>{label ?? "Image"}</span>
      )}
    </div>
  );
}
