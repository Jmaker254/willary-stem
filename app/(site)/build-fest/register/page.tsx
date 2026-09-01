import type { Metadata } from "next";
import Link from "next/link";
import BuildFestRegisterForm from "@/components/forms/BuildFestRegisterForm";
import { getSettings } from "@/lib/content";
import { ticketsLive } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Register — Willary BuildFest 2026",
  description:
    "Register a Main Challenge team, a Junior Builder school team, an attendee, or an exhibitor for Willary BuildFest 2026 in Nairobi on Saturday 21 November.",
};

export default async function RegisterPage() {
  const s = await getSettings();

  if (!ticketsLive()) {
    return (
      <section className="page-hero" style={{ minHeight: "60vh" }}>
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> »{" "}
            <Link href="/build-fest">Willary BuildFest 2026</Link> » Tickets
          </p>
          <h1>Ticket sales open soon</h1>
          <p style={{ maxWidth: "52ch" }}>
            Registration and M-Pesa checkout for Willary BuildFest 2026
            ({s.buildFestDate}, {s.buildFestVenue}) go live shortly. Check back
            soon — or follow{" "}
            <a href="https://www.instagram.com/willarystemrobotics1">
              @willarystemrobotics1
            </a>{" "}
            for the announcement.
          </p>
          <p style={{ marginTop: 24 }}>
            <Link className="btn btn--light" href="/build-fest">
              Back to BuildFest 2026
            </Link>{" "}
            <Link
              className="btn btn--ghost"
              href="/contact"
              style={{ marginLeft: 10, color: "#fff", borderColor: "rgba(255,255,255,.5)" }}
            >
              Ask a question
            </Link>
          </p>
        </div>
      </section>
    );
  }

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
