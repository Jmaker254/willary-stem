import type { Metadata } from "next";
import Link from "next/link";
import SlotImage from "@/components/site/SlotImage";
import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import SocialLinks from "@/components/site/SocialLinks";
import { getSettings, getPageImages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Willary STEM — Nairobi. Phone, email, socials, and an enquiry form for schools, sponsors, and build commissions.",
};

export default async function ContactPage() {
  const [settings, pageImages] = await Promise.all([
    getSettings(),
    getPageImages(),
  ]);

  return (
    <>
      <PageHero bg={pageImages["contact_hero"]?.url || null}>
        <p className="breadcrumb">
          <Link href="/">Home</Link> » Contact
        </p>
        <h1>Contact</h1>
        <p>
          Schools, sponsors, exhibitors, and anyone who wants a robot or
          hardware built — get in touch.
        </p>
      </PageHero>

      <section className="section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Reach Willary STEM</span>
            <h2>Get in touch</h2>
            <p>
              We&apos;re a Nairobi-based team of one who ships a lot — expect a
              direct reply.
            </p>
            <ul className="contact-list">
              <li>
                <span className="icon">📞</span>
                <div>
                  <h3>Phone / WhatsApp</h3>
                  <p>
                    <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>
                      {settings.phone}
                    </a>
                  </p>
                </div>
              </li>
              <li>
                <span className="icon">✉️</span>
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </p>
                </div>
              </li>
              <li>
                <span className="icon">📍</span>
                <div>
                  <h3>Location</h3>
                  <p>{settings.location}</p>
                </div>
              </li>
              <li>
                <span className="icon">💳</span>
                <div>
                  <h3>Payments</h3>
                  <p>
                    M-Pesa Paybill · NCBA business account · KRA / eTIMS tax
                    invoices
                  </p>
                </div>
              </li>
              <li>
                <span className="icon">🧾</span>
                <div>
                  <h3>Registration</h3>
                  <p>
                    Willary STEM / Willarystem Robotics · Reg. No. {settings.regNo}
                  </p>
                </div>
              </li>
            </ul>
            <SocialLinks social={settings.social} />
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SlotImage
            images={pageImages}
            slot="contact_map"
            label={`Map — ${settings.location}`}
            variant="wide"
          />
        </div>
      </section>
    </>
  );
}
