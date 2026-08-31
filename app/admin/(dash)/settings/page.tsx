import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireUser("EDITOR");
  const s = await getSettings();

  const values: Record<string, string> = {
    siteName: s.siteName,
    tagline: s.tagline,
    regNo: s.regNo,
    phone: s.phone,
    email: s.email,
    location: s.location,
    announceText: s.announceText,
    announceLink: s.announceLink,
    announceLinkLabel: s.announceLinkLabel,
    buildFestDate: s.buildFestDate,
    buildFestCapacity: String(s.buildFestCapacity),
    buildFestTime: s.buildFestTime,
    buildFestVenue: s.buildFestVenue,
    buildFestTicketKes: s.buildFestTicketKes,
    logoUrl: s.logoUrl,
    photosAlbumUrl: s.photosAlbumUrl,
    "social.tiktok": s.social.tiktok,
    "social.instagram": s.social.instagram,
    "social.linkedin": s.social.linkedin,
    "social.youtube": s.social.youtube,
    "social.x": s.social.x,
    "social.facebook": s.social.facebook,
  };

  return (
    <>
      <h1>Settings</h1>
      <p style={{ color: "var(--body)", marginTop: -8 }}>
        These values appear across the public site. Changes take effect
        immediately.
      </p>
      <SettingsForm values={values} />
    </>
  );
}
