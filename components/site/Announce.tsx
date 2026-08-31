import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Announce({ settings }: { settings: SiteSettings }) {
  return (
    <div className="announce">
      <div className="container">
        <span>🚀 {settings.announceText}</span>
        <Link href={settings.announceLink}>{settings.announceLinkLabel}</Link>
      </div>
    </div>
  );
}
