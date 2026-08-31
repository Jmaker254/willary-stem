import type { Metadata } from "next";
import Link from "next/link";
import BuildFestRegisterForm from "@/components/forms/BuildFestRegisterForm";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Register — Willary BuildFest 2026",
  description:
    "Register a Main Challenge team, a Junior Builder school team, an attendee, or an exhibitor for Willary BuildFest 2026 in Nairobi on Saturday 21 November.",
};

export default async function RegisterPage() {
  const s = await getSettings();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> »{" "}
            <Link href="/build-fest">Willary BuildFest 2026</Link> » Register
          </p>
          <h1>Register for Willary BuildFest 2026</h1>
          <p>
            {s.buildFestVenue} · {s.buildFestDate}. Entry is KES{" "}
            {s.buildFestTicketKes} per attendee.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Before you register</span>
            <h2>How it works</h2>
            <ul className="facts">
              <li>
                <span>
                  <strong>Main Challenge</strong> — form a team of 1–5, pick one
                  of the 8 tracks, and build a solution on the day.
                </span>
              </li>
              <li>
                <span>
                  <strong>Junior Builder Programme</strong> — high-school / school
                  teams get the brief 4–6 weeks early and bring their build to
                  present. Every student gets a certificate.
                </span>
              </li>
              <li>
                <span>
                  <strong>Attendees</strong> pay KES {s.buildFestTicketKes}.
                  <strong> Exhibitors</strong> pick &ldquo;Exhibitor&rdquo; here —
                  stand pricing is on the{" "}
                  <Link href="/build-fest#exhibit">BuildFest page</Link>.
                </span>
              </li>
              <li>
                <span>
                  Registration is a <strong>request</strong> — we confirm your
                  place and send payment details by email. If we&apos;re at
                  capacity you&apos;ll be added to the waitlist automatically.
                </span>
              </li>
            </ul>
          </div>
          <BuildFestRegisterForm ticketKes={s.buildFestTicketKes} />
        </div>
      </section>
    </>
  );
}
