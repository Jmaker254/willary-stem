"use client";

import { useActionState } from "react";
import { saveSettings } from "@/actions/admin/settings";
import { IDLE } from "@/lib/form";
import SubmitButton from "@/components/forms/SubmitButton";
import FormMessage from "@/components/forms/FormMessage";
import { MediaPicker } from "@/components/admin/MediaPicker";

const GROUPS: { title: string; fields: [string, string, string?][] }[] = [
  {
    title: "Identity",
    fields: [
      ["siteName", "Site name"],
      ["tagline", "Tagline"],
      ["regNo", "Registration number"],
    ],
  },
  {
    title: "Contact",
    fields: [
      ["phone", "Phone / WhatsApp"],
      ["email", "Email"],
      ["location", "Location"],
    ],
  },
  {
    title: "Media",
    fields: [
      [
        "photosAlbumUrl",
        'Photos album link (Google Photos) — powers the "See more" buttons',
      ],
    ],
  },
  {
    title: "Announcement bar",
    fields: [
      ["announceText", "Text"],
      ["announceLink", "Link (path or URL)"],
      ["announceLinkLabel", "Link label"],
    ],
  },
  {
    title: "BuildFest 2026",
    fields: [
      ["buildFestDate", "Date text"],
      ["buildFestTime", "Time"],
      ["buildFestVenue", "Venue"],
      ["buildFestTicketKes", "Ticket price (KES)"],
      ["buildFestCapacity", "Capacity / registration cap (number)", "number"],
    ],
  },
  {
    title: "Social links",
    fields: [
      ["social.tiktok", "TikTok URL"],
      ["social.instagram", "Instagram URL"],
      ["social.youtube", "YouTube URL"],
      ["social.x", "X (Twitter) URL"],
      ["social.facebook", "Facebook URL"],
      ["social.linkedin", "LinkedIn URL"],
    ],
  },
];

export default function SettingsForm({
  values,
}: {
  values: Record<string, string>;
}) {
  const [state, action] = useActionState(saveSettings, IDLE);
  return (
    <form action={action} className="admin-form">
      <div className="panel">
        <h2>Logo</h2>
        <p className="hint" style={{ marginTop: 0 }}>
          Replaces the ⬡ mark in the header and footer. Use a transparent PNG or
          SVG, ideally ~40&nbsp;px tall. Leave empty to keep the default mark.
        </p>
        <MediaPicker
          name="logoUrl"
          defaultValue={values.logoUrl ?? ""}
          accept="image/png,image/svg+xml,image/webp,image/jpeg"
        />
      </div>

      {GROUPS.map((g) => (
        <div className="panel" key={g.title}>
          <h2>{g.title}</h2>
          {g.title === "Social links" && (
            <p className="hint" style={{ marginTop: 0 }}>
              Leave a field blank to hide that icon on the site.
            </p>
          )}
          {g.fields.map(([name, label, type]) => (
            <div className="field" key={name}>
              <label htmlFor={`set-${name}`}>{label}</label>
              <input
                id={`set-${name}`}
                name={name}
                type={type === "number" ? "number" : "text"}
                defaultValue={values[name] ?? ""}
              />
            </div>
          ))}
        </div>
      ))}
      <div className="inline-actions">
        <SubmitButton className="btn btn--primary">Save settings</SubmitButton>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
