import Media from "./Media";
import type { PageImageMap } from "@/lib/types";
import type { CSSProperties } from "react";

/**
 * A fixed page-image slot. Renders the admin-set image for `slot`, or a
 * labelled placeholder when none is set. Edit at /admin/images.
 */
export default function SlotImage({
  images,
  slot,
  label,
  variant,
  priority,
  className,
  style,
}: {
  images: PageImageMap;
  slot: string;
  label: string;
  variant?: "tall" | "wide";
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const entry = images[slot];
  return (
    <Media
      src={entry?.url ?? undefined}
      alt={entry?.alt ?? label}
      label={label}
      variant={variant}
      priority={priority}
      className={className}
      style={style}
    />
  );
}
