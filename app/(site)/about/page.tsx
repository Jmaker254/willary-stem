import type { Metadata } from "next";
import Link from "next/link";
import SlotImage from "@/components/site/SlotImage";
import PageHero from "@/components/site/PageHero";
import TeamGrid from "@/components/site/TeamGrid";
import { getSettings, getSiteStats, getTeam, getPageImages } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Willary STEM is a Nairobi-based STEM education and robotics company founded and run by William Otwola. Our story, philosophy, and registration credibility.",
};

export default async function AboutPage() {
  const [settings, stats, team, pageImages] = await Promise.all([
    getSettings(),
    getSiteStats("about"),
    getTeam(),
    getPageImages(),
  ]);

  const aboutHeroBg = pageImages["about_hero"]?.url || null;

  return (
    <>
      <PageHero bg={aboutHeroBg}>
        <p className="breadcrumb">
          <Link href="/">Home</Link> » About
        </p>
        <h1>About Willary STEM</h1>
        <p>
          A Nairobi-based STEM education and robotics company — founded, built,
          and run by one person who ships real work.
        </p>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>The story</h2>
            <p>
              Willary STEM — also known as Willarystem Robotics — is a
              Nairobi-based STEM education and robotics company founded and run
              solely by William Otwola. It grew out of a simple frustration: too
              much STEM teaching in Kenya ends in a certificate and very little
              ability to actually build something.
            </p>
            <p>
              So the work started the other way round. Real robots, real
              hardware, and real deployments first — then school workshops and
              community visits built on top of that same hands-on practice.
              Today Willary STEM delivers coding and robotics programs in
              schools, designs custom PCBs and IoT systems, takes robots into
              communities, and runs maker events across the city.
            </p>

            <h2>What we believe</h2>
            <p>
              Our tagline is <strong>&ldquo;{settings.tagline}.&rdquo;</strong>{" "}
              Three ideas run through everything we do:
            </p>
            <ul>
              <li>
                <strong>Build with locally available materials.</strong> If a
                student can&apos;t source or afford the parts, the lesson
                doesn&apos;t transfer. Projects are designed around what&apos;s
                actually available in Nairobi and beyond.
              </li>
              <li>
                <strong>Reverse-engineer to teach fundamentals.</strong> We take
                working systems apart to reveal the principles underneath, then
                rebuild them. Understanding comes from taking responsibility for
                how something works.
              </li>
              <li>
                <strong>Chess before circuits.</strong> Critical thinking,
                planning several moves ahead, and sitting with a hard problem —
                we teach these through chess before the technical content begins.
              </li>
            </ul>

            <h2>Brand &amp; series</h2>
            <ul>
              <li>
                <strong>Akili Culture / Dr. Resistor</strong> — a performance
                brand that brings robotics to school cultural days in a form
                students remember.
              </li>
              <li>
                <strong>Nairobi Builds</strong> — a content series documenting
                local makers and the things they build.
              </li>
              <li>
                Ongoing thought-leadership on LinkedIn and build content on
                TikTok / Instagram{" "}
                <a href={settings.social.instagram}>@willarystemrobotics1</a>.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container highlight">
          <div>
            <span className="eyebrow">Registered &amp; Compliant</span>
            <h2>A business you can invoice</h2>
            <p>
              Willary STEM is a formally registered Kenyan business with the
              banking and tax infrastructure sponsors and schools expect.
            </p>
            <ul className="facts">
              <li>
                <span>
                  Registered June 2026 — <strong>Reg. No. {settings.regNo}</strong>
                </span>
              </li>
              <li>
                <span>NCBA business bank account</span>
              </li>
              <li>
                <span>M-Pesa Paybill for payments</span>
              </li>
              <li>
                <span>KRA / eTIMS compliant — proper tax invoices issued</span>
              </li>
            </ul>
            <Link className="btn btn--primary" href="/partner">
              Partner With Us
            </Link>
          </div>
          <SlotImage
            images={pageImages}
            slot="about_founder"
            label="Founder &amp; workbench"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Traction So Far</span>
            <h2>Early, but real</h2>
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

      {team.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Meet the team</span>
              <h2>The people behind Willary STEM</h2>
            </div>
            <TeamGrid members={team} />
          </div>
        </section>
      )}

      <section className="section section--tint">
        <div className="container newsletter">
          <span className="eyebrow">Get Involved</span>
          <h2>Sponsor the work or bring it to your school</h2>
          <p style={{ marginTop: 16 }}>
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
