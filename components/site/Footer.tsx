/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import NewsletterForm from "@/components/forms/NewsletterForm";
import SocialLinks from "@/components/site/SocialLinks";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              {settings.logoUrl ? (
                <img
                  className="brand-logo"
                  src={settings.logoUrl}
                  alt={settings.siteName}
                />
              ) : (
                <>
                  <span className="mark" aria-hidden>
                    ⬡
                  </span>{" "}
                  {settings.siteName}
                </>
              )}
            </div>
            <p>
              Nairobi-based STEM education and robotics company. Building
              problem-solvers, not certificate holders — with locally available
              materials, reverse-engineering, and chess for critical thinking.
            </p>
            <SocialLinks social={settings.social} />
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <Link href="/programs">Programs</Link>
              </li>
              <li>
                <Link href="/lab">Robotics &amp; Innovation Lab</Link>
              </li>
              <li>
                <Link href="/impact">Community Impact</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/blog">Blog &amp; news</Link>
              </li>
              <li>
                <Link href="/build-fest">BuildFest 2026</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Work With Us</h4>
            <ul>
              <li>
                <Link href="/partner">Partner With Us</Link>
              </li>
              <li>
                <Link href="/partner#sponsor">Sponsor tiers</Link>
              </li>
              <li>
                <Link href="/partner#exhibit">Exhibitor pricing</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>{settings.siteName}</h4>
            <ul>
              <li>📍 {settings.location}</li>
              <li>
                📞{" "}
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>
                  {settings.phone}
                </a>
              </li>
              <li>
                ✉️ <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
              <li>Reg. No. {settings.regNo}</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <h4 style={{ color: "#fff", marginBottom: 12 }}>Stay in the loop</h4>
          <NewsletterForm source="footer" />
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {year} {settings.siteName} / Willarystem Robotics · Registered
            June 2026 · KRA / eTIMS compliant
          </span>
          <span>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
