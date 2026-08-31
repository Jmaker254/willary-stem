import type { Metadata } from "next";
import Link from "next/link";
import PartnerForm from "@/components/forms/PartnerForm";
import PartnerWall from "@/components/site/PartnerWall";
import {
  getSettings,
  getSiteStats,
  getSponsorTiers,
  getPartners,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Sponsor Willary STEM's school programs, community robot visits, and Willary BuildFest 2026. Sponsor tiers, exhibitor pricing, and a partnership enquiry form.",
};

const WAYS = [
  { icon: "🏫", title: "Sponsor a school program", body: "Fund a term of coding, electronics, or robotics for a school that can't cover the cost." },
  { icon: "🌍", title: "Sponsor community visits", body: "Cover transport, equipment, and materials for robot visits toward the 1,000-child goal." },
  { icon: "🚀", title: "Sponsor BuildFest 2026", body: "Back Kenya's first clean-tech innovation event — brand visibility with 150–300+ builders, students and innovators." },
  { icon: "🔧", title: "Commission a build", body: "Custom PCB, robot, or IoT system designed and delivered by the Willary lab." },
  { icon: "🎁", title: "In-kind support", body: "Components, tools, prizes, venue, catering, or transport — all useful." },
  { icon: "🤝", title: "Long-term partner", body: "An annual partnership across programs, events, and content." },
];

const EXHIBITOR = [
  ["Premium", "Prime floor position, large stand, maximum visibility", "30,000"],
  ["Standard", "Standard Builders Market stand with signage and passes", "20,000"],
  ["Basic", "Table space to display and demo your product", "10,000"],
];

export default async function PartnerPage() {
  const [settings, stats, tiers, partners] = await Promise.all([
    getSettings(),
    getSiteStats("partner"),
    getSponsorTiers(),
    getPartners(),
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » Partner With Us
          </p>
          <h1>Partner With Us</h1>
          <p>
            Back real, visible STEM work in Kenya — school programs, community
            robot visits, and Willary BuildFest 2026.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why Partner</span>
            <h2>Your support goes into work that ships</h2>
            <p>
              Willary STEM is a registered, tax-compliant business that delivers
              programs, publishes its builds, and runs events — sponsorship is
              spent on delivery, not overhead.
            </p>
          </div>
          <div className="statrow">
            {stats.map((s) => (
              <div key={s.key}>
                <div className="num">{s.num}</div>
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Ways to Partner</span>
            <h2>Pick what fits your goals</h2>
          </div>
          <div className="grid grid--3">
            {WAYS.map((w) => (
              <article className="card" key={w.title}>
                <div className="icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="sponsor">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Sponsor Tiers · BuildFest 2026</span>
            <h2>Sponsorship packages</h2>
            <p>
              Indicative benefits — packages can be tailored to your objectives
              and budget.
            </p>
          </div>
          <div className="tiers">
            {tiers.map((t) => (
              <article
                className={`tier${t.featured ? " is-featured" : ""}`}
                key={t.name}
              >
                <h3>{t.name}</h3>
                <div className="price">{t.price}</div>
                <ul>
                  {t.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link
                  className={`btn ${t.featured ? "btn--primary" : "btn--ghost"} btn--block`}
                  href="#enquiry"
                >
                  Enquire
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" id="exhibit">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Exhibitor Pricing · BuildFest 2026</span>
            <h2>Exhibitor stands</h2>
            <p>Reserve a stand in the Builders Market.</p>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Includes</th>
                  <th>Price (KES)</th>
                </tr>
              </thead>
              <tbody>
                {EXHIBITOR.map(([a, b, c]) => (
                  <tr key={a}>
                    <td>{a}</td>
                    <td>{b}</td>
                    <td>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="section">
          <div className="container section-head" style={{ maxWidth: 820 }}>
            <span className="eyebrow">In good company</span>
            <h2>Past partners &amp; collaborators</h2>
            <p>
              Organisations that have worked with Willary STEM on programs,
              events and builds. Sponsorship backs the event and Kenya&apos;s
              builder community as a whole.
            </p>
            <PartnerWall partners={partners} />
          </div>
        </section>
      )}

      <section className="section section--alt" id="enquiry">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Partnership Enquiry</span>
            <h2>Tell us what you have in mind</h2>
            <p>
              Send a few details and we&apos;ll reply with the current
              partnership pack and a call time.
            </p>
            <ul className="contact-list">
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
                <span className="icon">📞</span>
                <div>
                  <h3>Phone</h3>
                  <p>
                    <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>
                      {settings.phone}
                    </a>
                  </p>
                </div>
              </li>
              <li>
                <span className="icon">📍</span>
                <div>
                  <h3>Based in</h3>
                  <p>{settings.location}</p>
                </div>
              </li>
              <li>
                <span className="icon">🧾</span>
                <div>
                  <h3>Registered</h3>
                  <p>Reg. No. {settings.regNo} · KRA / eTIMS compliant</p>
                </div>
              </li>
            </ul>
          </div>
          <PartnerForm />
        </div>
      </section>
    </>
  );
}
