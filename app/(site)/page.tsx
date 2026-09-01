import type { Metadata } from "next";
import Link from "next/link";
import SlotImage from "@/components/site/SlotImage";
import PartnerWall from "@/components/site/PartnerWall";
import ComingSoonButton from "@/components/site/ComingSoonButton";
import HeroBgSlides from "@/components/site/HeroBgSlides";
import { ticketsLive } from "@/lib/flags";
import {
  getSettings,
  getSiteStats,
  getFeaturedProjects,
  getSchools,
  getPartners,
  getPageImages,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Willary STEM — Robotics, Coding & Clean-Tech in Nairobi",
  description:
    "Willary STEM runs school coding & robotics workshops, builds real robots and IoT hardware, takes robots into Nairobi communities, and hosts Willary BuildFest 2026 — Kenya's first clean-technology innovation event.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Willary STEM — Robotics, Coding & Clean-Tech in Nairobi",
    description:
      "School workshops, robot & IoT builds, community robot visits, and Willary BuildFest 2026.",
    url: "/",
  },
};

const CAT_ICON: Record<string, string> = { ROBOT: "🤖", PCB: "🔌", IOT: "📡" };

export default async function HomePage() {
  const [settings, stats, featured, schools, partners, pageImages] =
    await Promise.all([
      getSettings(),
      getSiteStats("home"),
      getFeaturedProjects(),
      getSchools(),
      getPartners(),
      getPageImages(),
    ]);

  const homeSlides = ["home_hero", "home_hero_2", "home_hero_3", "home_hero_4"]
    .map((slot) => pageImages[slot]?.url)
    .filter((url): url is string => Boolean(url));

  return (
    <>
      {/* Hero */}
      <section className={`hero${homeSlides.length > 0 ? " has-slides" : ""}`}>
        {homeSlides.length > 0 && <HeroBgSlides images={homeSlides} />}
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              STEM Education &amp; Robotics · {settings.location}
            </span>
            <h1>{settings.tagline}</h1>
            <p className="lead">
              Willary STEM runs school workshops, builds real robots and
              hardware, and takes robotics into communities across Kenya —
              teaching fundamentals through reverse-engineering, locally
              available materials, and chess for critical thinking.
            </p>
            <div className="hero-cta">
              <Link className="btn btn--primary" href="/partner">
                Partner With Us
              </Link>
              <Link className="btn btn--ghost" href="/lab">
                See Our Work
              </Link>
            </div>
            <div className="hero-stats">
              {stats.slice(0, 3).map((s) => (
                <div key={s.key}>
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {homeSlides.length === 0 && (
            <SlotImage
              images={pageImages}
              slot="home_hero"
              label="Students building robots with local materials"
              variant="tall"
              priority
            />
          )}
        </div>
      </section>

      {/* Quick stats */}
      <section className="section section--alt">
        <div className="container">
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

      {/* Build Fest banner */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <span className="eyebrow" style={{ color: "#dbe6ff" }}>
              Flagship event · Built for Kenya. Built for Africa.
            </span>
            <h2>Willary BuildFest 2026 — Building a Cleaner Future</h2>
            <p>
              {settings.buildFestDate}, Nairobi. Kenya&apos;s first
              multidisciplinary clean-technology innovation event — 8 challenge
              tracks, 2 levels, KES {settings.buildFestTicketKes} entry.
            </p>
            <p style={{ marginTop: 18 }}>
              <Link className="btn btn--light" href="/build-fest">
                Explore BuildFest 2026
              </Link>{" "}
              {ticketsLive() ? (
                <Link
                  className="btn btn--ghost"
                  href="/build-fest/register"
                  style={{ marginLeft: 10, color: "#fff", borderColor: "rgba(255,255,255,.5)" }}
                >
                  Register
                </Link>
              ) : (
                <ComingSoonButton
                  className="btn btn--ghost"
                  style={{ marginLeft: 10, color: "#fff", borderColor: "rgba(255,255,255,.5)" }}
                >
                  Get Tickets
                </ComingSoonButton>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Do</span>
            <h2>One company, four kinds of work</h2>
          </div>
          <div className="grid grid--4">
            <article className="card">
              <div className="icon">🏫</div>
              <h3>School Programs</h3>
              <p>
                Coding (Scratch, PictoBlocks), electronics, and ESP32/Arduino
                robotics workshops delivered in schools.
              </p>
              <Link className="card-link" href="/programs">
                See programs →
              </Link>
            </article>
            <article className="card">
              <div className="icon">🤖</div>
              <h3>Robotics &amp; Innovation Lab</h3>
              <p>
                Original robots, custom PCB design, and deployed IoT systems —
                proof of real technical depth.
              </p>
              <Link className="card-link" href="/lab">
                Inside the lab →
              </Link>
            </article>
            <article className="card">
              <div className="icon">🌍</div>
              <h3>Community Impact</h3>
              <p>
                Robot visits bringing hands-on robotics to children who have
                never seen it — 66 reached, aiming for 1,000+.
              </p>
              <Link className="card-link" href="/impact">
                Our impact →
              </Link>
            </article>
            <article className="card">
              <div className="icon">🎪</div>
              <h3>Events</h3>
              <p>
                Coffee &amp; Solder meetups, World Robot Competition Nairobi, and
                Willary BuildFest 2026.
              </p>
              <Link className="card-link" href="/events">
                What&apos;s on →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section">
        <div className="container highlight">
          <div>
            <span className="eyebrow">Our Approach</span>
            <h2>Understanding before certificates</h2>
            <p>
              We teach the way builders actually learn — by taking things apart,
              rebuilding them with what&apos;s on hand, and thinking clearly
              before touching a keyboard.
            </p>
            <ul className="facts">
              <li>
                <span>
                  <strong>Locally available materials</strong> — projects use
                  parts a Kenyan student can actually source and afford.
                </span>
              </li>
              <li>
                <span>
                  <strong>Reverse-engineering</strong> — pull a system apart to
                  teach the fundamentals behind it.
                </span>
              </li>
              <li>
                <span>
                  <strong>Chess first</strong> — critical thinking and planning
                  before the technical content begins.
                </span>
              </li>
            </ul>
            <Link className="btn btn--primary" href="/about">
              Read our story
            </Link>
          </div>
          <SlotImage
            images={pageImages}
            slot="home_philosophy"
            label="Reverse-engineering session"
          />
        </div>
      </section>

      {/* Selected work */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Selected Work</span>
            <h2>A sample of what we&apos;ve built</h2>
            <p>
              From AI-controlled robots to deployed farm irrigation — see the
              full catalogue in the lab.
            </p>
          </div>
          <div className="grid grid--4">
            {featured.map((p) => (
              <article className="card" key={p.slug}>
                <div className="icon">{CAT_ICON[p.category]}</div>
                <h3>{p.title}</h3>
                <p>{p.summary.split(". ")[0]}.</p>
                <Link className="card-link" href={`/lab#${p.slug}`}>
                  Details →
                </Link>
              </article>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 32 }}>
            <Link className="btn btn--ghost" href="/lab">
              See all projects
            </Link>
          </p>
        </div>
      </section>

      {/* Schools */}
      <section className="section">
        <div className="container section-head">
          <span className="eyebrow">Trusted By</span>
          <h2>Schools &amp; academies we&apos;ve worked with</h2>
          <ul className="chips" style={{ justifyContent: "center" }}>
            {schools.map((s) => (
              <li key={s.name}>{s.name}</li>
            ))}
          </ul>
          {partners.length > 0 && (
            <>
              <p className="eyebrow" style={{ marginTop: 36 }}>
                Partners &amp; collaborators
              </p>
              <PartnerWall partners={partners} bare />
            </>
          )}
        </div>
      </section>

      {/* Partner CTA */}
      <section className="section section--tint">
        <div className="container newsletter">
          <span className="eyebrow">Work With Us</span>
          <h2>Bring Willary STEM to your school, or sponsor the work</h2>
          <p>
            School programs, hardware and IoT builds, community visits, and
            Willary BuildFest 2026 partnerships.
          </p>
          <p style={{ marginTop: 20 }}>
            <Link className="btn btn--primary" href="/partner">
              Partner With Us
            </Link>{" "}
            <Link
              className="btn btn--ghost"
              href="/contact"
              style={{ marginLeft: 10 }}
            >
              Contact
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
