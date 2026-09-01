import type { Metadata } from "next";
import Link from "next/link";
import SlotImage from "@/components/site/SlotImage";
import Testimonials from "@/components/site/Testimonials";
import CohortBookingForm from "@/components/forms/CohortBookingForm";
import {
  getSchools,
  getPageImages,
  getCohorts,
  getTestimonials,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "School workshops and bootcamps in coding (Scratch, PictoBlocks), electronics, and ESP32/Arduino robotics — book an upcoming online or in-person class.",
};

const MODE_LABEL: Record<string, string> = {
  ONLINE: "Online",
  PHYSICAL: "In person",
  HYBRID: "Hybrid",
};

export default async function ProgramsPage() {
  const [schools, pageImages, cohorts, studentQuotes] = await Promise.all([
    getSchools(),
    getPageImages(),
    getCohorts(),
    getTestimonials("students"),
  ]);
  const offerBg = pageImages["programs_offer_bg"]?.url || null;
  const upcoming = cohorts.filter((c) => c.status !== "CLOSED");

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » Programs
          </p>
          <h1>Programs</h1>
          <p>
            Coding, electronics, and robotics — online or in person. Book an
            upcoming class, or bring a program to your school.
          </p>
        </div>
      </section>

      {/* Curriculum approach */}
      <section className="section">
        <div className="container hero-grid" style={{ alignItems: "start" }}>
          <div>
            <span className="eyebrow">Curriculum Approach</span>
            <h2>How a Willary program runs</h2>
            <div className="steps steps--2" style={{ marginTop: 16 }}>
              <div className="step">
                <h3>Chess &amp; thinking</h3>
                <p>Sessions open with chess and structured problem-solving.</p>
              </div>
              <div className="step">
                <h3>Take it apart</h3>
                <p>Reverse-engineer a working device to uncover the fundamentals.</p>
              </div>
              <div className="step">
                <h3>Rebuild locally</h3>
                <p>Rebuild with parts students can source and afford.</p>
              </div>
              <div className="step">
                <h3>Ship a project</h3>
                <p>Each block ends with a working build they can demo and explain.</p>
              </div>
            </div>
          </div>
          <SlotImage
            images={pageImages}
            slot="programs_hero"
            label="A Willary class in session"
            variant="tall"
            priority
          />
        </div>
      </section>

      {/* What we offer — with background image */}
      <section
        className={`section section--alt${offerBg ? " section--photo" : ""}`}
        style={offerBg ? { backgroundImage: `url(${offerBg})` } : undefined}
      >
        {offerBg && <div className="section-photo-overlay" aria-hidden />}
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Offer</span>
            <h2>What we deliver</h2>
          </div>
          <div className="grid grid--2">
            <article className="card">
              <div className="icon">🧩</div>
              <h3>Coding</h3>
              <p>
                Block-based programming with Scratch and PictoBlocks, moving into
                logic, loops, events, and simple game and animation projects.
              </p>
              <ul className="chips">
                <li>Scratch</li>
                <li>PictoBlocks</li>
                <li>Ages 8+</li>
              </ul>
            </article>
            <article className="card">
              <div className="icon">⚡</div>
              <h3>Electronics</h3>
              <p>
                Circuits, components, soldering, and safe hands-on practice — the
                foundation every robotics student needs.
              </p>
              <ul className="chips">
                <li>Circuits</li>
                <li>Soldering</li>
                <li>Breadboarding</li>
              </ul>
            </article>
            <article className="card">
              <div className="icon">🤖</div>
              <h3>ESP32 / Arduino Robotics</h3>
              <p>
                Building and programming microcontroller robots: sensors, motors,
                wireless control, and autonomous behaviour.
              </p>
              <ul className="chips">
                <li>ESP32</li>
                <li>Arduino</li>
                <li>Sensors &amp; motors</li>
              </ul>
            </article>
            <article className="card">
              <div className="icon">🚀</div>
              <h3>Bootcamps</h3>
              <p>
                Intensive multi-day builds for keen students and competition
                teams — including World Robot Olympiad preparation.
              </p>
              <ul className="chips">
                <li>Holiday intensives</li>
                <li>Competition prep</li>
                <li>Team builds</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Upcoming classes — bookable cohorts */}
      <section className="section" id="classes">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Upcoming Classes</span>
            <h2>Book a place</h2>
            <p>Online and in-person cohorts. Pick one and request a place below.</p>
          </div>

          {upcoming.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No dates are open right now —{" "}
              <Link href="/contact">tell us what you&apos;re after</Link> and
              we&apos;ll let you know when the next cohort opens.
            </p>
          ) : (
            <>
              <div className="grid grid--3" style={{ marginBottom: 40 }}>
                {upcoming.map((c) => (
                  <article className="card cohort-card" key={c.id}>
                    <div className="cohort-tags">
                      <span className={`cohort-mode is-${c.mode.toLowerCase()}`}>
                        {MODE_LABEL[c.mode]}
                      </span>
                      {c.status === "FULL" && (
                        <span className="cohort-mode is-full">Full — waitlist</span>
                      )}
                      {c.status === "UPCOMING" && (
                        <span className="cohort-mode">Dates soon</span>
                      )}
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.summary}</p>
                    <ul className="facts" style={{ margin: "14px 0 0", fontSize: "0.9rem" }}>
                      <li>{c.startText}</li>
                      <li>{c.scheduleText}</li>
                      {c.location && <li>{c.location}</li>}
                      {c.ageRange && <li>{c.ageRange}</li>}
                      {c.priceKes && <li>{c.priceKes}</li>}
                    </ul>
                    <a className="card-link" href="#book">
                      Book this class →
                    </a>
                  </article>
                ))}
              </div>

              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <CohortBookingForm cohorts={upcoming} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Student testimonies */}
      {studentQuotes.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Student Voices</span>
              <h2>What students say</h2>
            </div>
            <Testimonials items={studentQuotes} />
          </div>
        </section>
      )}

      {/* Where we've delivered */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Where We&apos;ve Delivered</span>
            <h2>Schools &amp; academies</h2>
          </div>
          <div className="grid grid--2">
            {schools.map((s) => (
              <article className="card" key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container newsletter">
          <span className="eyebrow">For Schools</span>
          <h2>Bring Willary STEM to your students</h2>
          <p>
            Term-time programs, holiday bootcamps, and competition coaching. Tell
            us your year groups and timetable and we&apos;ll build a plan.
          </p>
          <p style={{ marginTop: 20 }}>
            <Link className="btn btn--primary" href="/contact">
              Request a program
            </Link>{" "}
            <Link
              className="btn btn--ghost"
              href="/partner"
              style={{ marginLeft: 10 }}
            >
              Partnership options
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
