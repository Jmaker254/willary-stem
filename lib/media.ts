/** Shared media helpers safe to import from client or server. */

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|ogv|ogg)(\?|#|$)/i.test(url);
}

/** Returns an <iframe> embed src for YouTube/Vimeo links, else null. */
export function embedUrl(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vim = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vim) return `https://player.vimeo.com/video/${vim[1]}`;
  return null;
}
