import Gallery from "./Gallery";

/**
 * Server wrapper — a few photos/videos in a grid that expand to a lightbox,
 * plus an optional link to a full album (e.g. Google Photos).
 */
export default function PhotoWall({
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
  return (
    <Gallery
      media={media}
      albumUrl={albumUrl}
      limit={limit}
      label={label}
      moreLabel={moreLabel}
    />
  );
}
