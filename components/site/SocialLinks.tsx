import type { SiteSettings } from "@/lib/types";

/** Simple monochrome brand glyphs (currentColor). */
const ICONS: Record<string, React.ReactNode> = {
  tiktok: (
    <path d="M16.5 5.6c-.9-.6-1.5-1.6-1.7-2.6h-2.7v11.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.1a5.5 5.5 0 1 0 4.5 5.4V9a6.7 6.7 0 0 0 3.7 1.1V7.4c-.8 0-1.5-.2-2-.6z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.3" />
    </>
  ),
  youtube: (
    <>
      <path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5A2.5 2.5 0 0 0 2.4 7.3 26 26 0 0 0 2 12c0 1.6 0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12z" />
      <path d="M10 15.5v-7l6 3.5z" fill="#fff" />
    </>
  ),
  linkedin: (
    <path d="M6.5 8.5V19H3.3V8.5h3.2zM4.9 3.4a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM20.7 19h-3.2v-5.6c0-1.4-.5-2.3-1.7-2.3-1 0-1.5.6-1.8 1.3-.1.2-.1.6-.1.9V19H10.7s.04-9.5 0-10.5h3.2v1.5c.4-.7 1.2-1.7 3-1.7 2.2 0 3.8 1.4 3.8 4.5V19z" />
  ),
  x: (
    <path d="M17.5 3h3l-6.6 7.5L22 21h-5.9l-4.3-5.6L6.7 21H3.6l7-8L2.3 3h6L12 8.1 17.5 3zm-1 16h1.7L7.6 4.8H5.8L16.5 19z" />
  ),
  facebook: (
    <path d="M14 8.5V6.7c0-.8.2-1.2 1.4-1.2H17V2.2C16.6 2.1 15.6 2 14.5 2 11.9 2 10.3 3.6 10.3 6.3v2.2H7.5V12h2.8v10h3.5V12h2.8l.4-3.5H14z" />
  ),
};

const LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  x: "X",
  facebook: "Facebook",
};

const ORDER = ["tiktok", "instagram", "youtube", "x", "facebook", "linkedin"];

function isReal(url: string | undefined): url is string {
  return !!url && url.trim() !== "" && url.trim() !== "#";
}

export default function SocialLinks({
  social,
  className = "socials",
}: {
  social: SiteSettings["social"];
  className?: string;
}) {
  const entries = ORDER.map((k) => [k, social[k as keyof typeof social]] as const).filter(
    ([, url]) => isReal(url),
  );
  if (entries.length === 0) return null;

  return (
    <div className={className}>
      {entries.map(([key, url]) => (
        <a
          key={key}
          href={url}
          aria-label={LABELS[key]}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
            {ICONS[key]}
          </svg>
        </a>
      ))}
    </div>
  );
}
