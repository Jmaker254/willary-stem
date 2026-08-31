import type { Metadata } from "next";
import Link from "next/link";
import SlotImage from "@/components/site/SlotImage";
import PhotoWall from "@/components/site/PhotoWall";
import {
  getSettings,
  getSponsorTiers,
  getEvents,
  getPageImages,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Willary BuildFest 2026 — Building a Cleaner Future",
  description:
    "Willary BuildFest 2026 — Kenya's first multidisciplinary clean-technology innovation event. Nairobi, Saturday 21 November 2026. Eight challenge tracks, two levels, KES 500 entry.",
  alternates: { canonical: "/build-fest" },
  openGraph: {
    title: "Willary BuildFest 2026 — Building a Cleaner Future",
    description:
      "Kenya's first multidisciplinary clean-technology innovation event. Nairobi, 21 November 2026.",
    url: "/build-fest",
  },
};

const TRACKS = [
  { n: 1, title: "Water & Environmental Protection", body: "Protect water sources, prevent pollution, build environmental monitoring systems." },
  { n: 2, title: "Smart Waste Collection", body: "Automated and smart systems for collecting waste in communities and urban areas." },
  { n: 3, title: "Waste Sorting", body: "AI-powered, sensor-based, or manual systems that sort waste by type." },
  { n: 4, title: "Recycling", body: "Technology that transforms waste into reusable materials and products." },
  { n: 5, title: "Waste-to-Business", body: "Turn waste into economic opportunity — products, services, and business models." },
  { n: 6, title: "Circular Economy", body: "Design out waste and keep materials in use for as long as possible." },
  { n: 7, title: "AI & Computer Vision", body: "Machine learning and AI-powered solutions for waste and environmental challenges." },
  { n: 8, title: "Smart Cities", body: "Technology for cleaner, smarter urban environments and infrastructure." },
];

const JUDGING = [
  "The problem identified",
  "Creativity of the solution",
  "Real-world usefulness",
  "Quality of execution",
];

const DAY = [
  { title: "Build Zone", body: "Teams develop and build their solutions throughout the day." },
  { title: "Robotics Arena", body: "Live robots, demonstrations and interactive activities." },
  { title: "Junior Showcase", body: "High-school students present their projects to judges and the crowd." },
  { title: "Builders Market", body: "Companies and startups showcase and sell technology products." },
  { title: "Stage", body: "Keynotes, panel discussions, demonstrations and final presentations." },
  { title: "Networking", body: "Meet engineers, developers, founders, mentors and investors." },
  { title: "Awards Ceremony", body: "Outstanding builders and teams recognised across all 8 tracks." },
];

const SUPPORT = [
  "Mentorship",
  "Resources",
  "Industry connections",
  "Product development",
  "Scaling pathways",
];

const AUDIENCE = [
  { icon: "🎓", title: "University Students", body: "Engineering · ICT · AI · Data · Design · Business — any discipline." },
  { icon: "🏫", title: "High-School Students", body: "Junior Builder Programme — individual or school teams." },
  { icon: "💻", title: "Software & AI Developers", body: "Build AI and computer-vision solutions in Track 7." },
  { icon: "🔧", title: "Engineers & Makers", body: "Hardware · robotics · electronics · mechatronics." },
  { icon: "🚀", title: "Entrepreneurs & Startups", body: "Waste-to-business and circular-economy innovators." },
  { icon: "👨‍👩‍👧", title: "Parents & Families", body: "Come and watch your child compete — Family Discovery Zone." },
  { icon: "🏬", title: "Companies & Exhibitors", body: "Showcase products to 150–300+ builders and innovators." },
];

const EXHIBITOR = [
  ["Premium", "Prime floor position, large stand, maximum visibility to the full crowd.", "30,000"],
  ["Standard", "Standard stand in the Builders Market with signage and passes.", "20,000"],
  ["Basic", "Table space to display and demo your product.", "10,000"],
];

export default async function BuildFestPage() {
  const [s, tiers, events, pageImages] = await Promise.all([
    getSettings(),
    getSponsorTiers(),
    getEvents(),
    getPageImages(),
  ]);
  const bf = events.find((e) => e.slug === "build-fest-2026");
  const poster = bf?.posterUrl || null;
  const exhibitorBg = pageImages["buildfest_exhibitor_bg"]?.url || null;
  const galleryMedia = bf?.photos ?? [];
  const galleryAlbum = bf?.albumUrl ?? s.photosAlbumUrl;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.willaryrobotics.com";

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Willary BuildFest 2026",
    description:
      "Kenya's first multidisciplinary clean-technology innovation event — 8 challenge tracks, two levels, one day in Nairobi.",
    startDate: "2026-11-21T08:00:00+03:00",
    endDate: "2026-11-21T17:30:00+03:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: s.buildFestVenue,
      address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
    },
    organizer: {
      "@type": "Organization",
      name: "Willary STEM Robotics",
      url: site,
    },
    offers: {
      "@type": "Offer",
      price: Number(s.buildFestTicketKes) || 500,
      priceCurrency: "KES",
      availability: "https://schema.org/InStock",
      url: `${site}/build-fest/register`,
      category: "Admission",
    },
    url: `${site}/build-fest`,
  };

  return (
    <div className={poster ? "bf-page has-poster" : "bf-page"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {poster && (
        <>
          <div
            className="event-poster-bg"
            style={{ backgroundImage: `url(${poster})` }}
            aria-hidden
          />
          <div className="poster-overlay" aria-hidden />
        </>
      )}
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              Willary BuildFest 2026 · Built for Kenya. Built for Africa.
            </span>
            <h1>Building a Cleaner Future</h1>
            <p className="lead">
              Technology · Innovation · Circular Solutions. {s.buildFestDate},
              Nairobi. Kenya&apos;s first multidisciplinary clean-technology
              innovation event.
            </p>
            <div className="hero-cta">
              <Link className="btn btn--primary" href="/build-fest/register">
                Register Your Team
              </Link>
              <Link className="btn btn--ghost" href="#tracks">
                See the 8 Tracks
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="num">8</div>
                <div className="lbl">Challenge tracks</div>
              </div>
              <div>
                <div className="num">2</div>
                <div className="lbl">Levels — everyone welcome</div>
              </div>
              <div>
                <div className="num">KES {s.buildFestTicketKes}</div>
                <div className="lbl">Per attendee</div>
              </div>
            </div>
          </div>
          {!poster && (
            <SlotImage
              images={pageImages}
              slot="buildfest_hero"
              label="Willary BuildFest 2026"
              variant="tall"
              priority
            />
          )}
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container">
          <div className="prose" style={{ margin: "0 auto" }}>
            <p style={{ fontSize: "1.15rem" }}>
              Imagine a room where a student from Mathare, an engineer from
              Strathmore, a developer from iHub, and an entrepreneur from
              Westlands are all solving the same problem — together. That room is
              BuildFest 2026.
            </p>
            <p>
              Willary BuildFest 2026 brings together students, engineers,
              developers, designers, entrepreneurs and builders from across
              Nairobi — and gives them one challenge:
            </p>
          </div>
          <div className="cta-band" style={{ marginTop: 24 }}>
            <h2 style={{ marginBottom: 0 }}>
              How can technology help build a cleaner Kenya and Africa?
            </h2>
          </div>
        </div>
      </section>

      {/* The challenge */}
      <section className="section section--alt">
        <div className="container highlight">
          <div>
            <span className="eyebrow">The Challenge</span>
            <h2>Building a cleaner future</h2>
            <p>
              Waste is one of the most urgent challenges in Kenya. In Nairobi
              alone, thousands of tonnes of waste go uncollected every day.
              Rivers are polluted. Communities are overwhelmed. And most of the
              technology that could help is sitting unused — or has never been
              built at all.
            </p>
            <p>
              BuildFest 2026 is about changing that. We&apos;re asking builders,
              thinkers, coders and creators to bring their skills and build
              practical solutions — in one day, in one room, with real impact.
            </p>
            <p>
              You don&apos;t need to be an expert. You need an idea and the
              willingness to build it.
            </p>
          </div>
          <SlotImage
            images={pageImages}
            slot="buildfest_cleaner"
            label="A cleaner Nairobi"
          />
        </div>
      </section>

      {/* 8 tracks */}
      <section className="section" id="tracks">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">8 Challenge Tracks</span>
            <h2>Pick your lane</h2>
            <p>Form a team, choose one track, and build a solution for it.</p>
          </div>
          <div className="grid grid--4">
            {TRACKS.map((t) => (
              <article className="card" key={t.n}>
                <div className="icon">{t.n}</div>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Judging */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How Teams Are Judged</span>
            <h2>Four things the judges look for</h2>
          </div>
          <div className="grid grid--4">
            {JUDGING.map((j, i) => (
              <article className="card" key={j}>
                <div className="icon">{i + 1}</div>
                <h3>{j}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Two levels */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Two Levels</span>
            <h2>Everyone is welcome</h2>
          </div>
          <div className="grid grid--2">
            <article className="card">
              <div className="icon">🏆</div>
              <h3>Main Challenge</h3>
              <p>
                University students · software developers · engineers · makers ·
                entrepreneurs · professionals.
              </p>
              <p>
                Form a team of 1–5. Choose one of the 8 tracks. Build a solution.
                Present to the judges. Win.
              </p>
            </article>
            <article className="card">
              <div className="icon">🎒</div>
              <h3>Junior Builder Programme</h3>
              <p>High-school students · school teams.</p>
              <p>
                Schools receive the challenge brief 4–6 weeks before the event.
                Students build their solution and bring it to BuildFest to
                present and compete. Every student receives a{" "}
                <strong>Junior Builder Certificate</strong> regardless of result.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* On the day */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">On the Day</span>
            <h2>What happens at BuildFest</h2>
          </div>
          <div className="grid grid--3">
            {DAY.map((d) => (
              <article className="card" key={d.title}>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Build -> Mentor -> Support -> Scale */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Build → Mentor → Support → Scale</span>
            <h2>It doesn&apos;t end at the awards</h2>
            <p>
              Outstanding projects have the opportunity to receive continued
              support after BuildFest.
            </p>
          </div>
          <ul className="chips" style={{ justifyContent: "center" }}>
            {SUPPORT.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who should come */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Who Should Come</span>
            <h2>Built for builders of every kind</h2>
          </div>
          <div className="grid grid--3">
            {AUDIENCE.map((a) => (
              <article className="card" key={a.title}>
                <div className="icon">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Key details */}
      <section className="section" id="tickets">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Key Event Details</span>
            <h2>Everything you need to know</h2>
          </div>
          <div className="table-wrap">
            <table className="data">
              <tbody>
                <tr><th>Date</th><td>{s.buildFestDate}</td></tr>
                <tr><th>Time</th><td>{s.buildFestTime} (full day)</td></tr>
                <tr><th>Location</th><td>{s.buildFestVenue}</td></tr>
                <tr><th>Expected</th><td>150–300+ participants across all levels</td></tr>
                <tr>
                  <th>Entry</th>
                  <td>
                    KES {s.buildFestTicketKes} per attendee — paid on registration
                    via an M-Pesa prompt to your phone
                  </td>
                </tr>
                <tr>
                  <th>Exhibitors</th>
                  <td>Premium KES 30,000 · Standard KES 20,000 · Basic KES 10,000</td>
                </tr>
                <tr><th>Organiser</th><td>Willary STEM Robotics — William Otwola</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: "center", marginTop: 28 }}>
            <Link className="btn btn--primary" href="/build-fest/register">
              Register — KES {s.buildFestTicketKes} per attendee
            </Link>
          </p>
        </div>
      </section>

      {/* Exhibitors */}
      <section
        className={`section section--alt${exhibitorBg ? " section--photo" : ""}`}
        id="exhibit"
        style={
          exhibitorBg
            ? { backgroundImage: `url(${exhibitorBg})` }
            : undefined
        }
      >
        {exhibitorBg && <div className="section-photo-overlay" aria-hidden />}
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Exhibitors</span>
            <h2>Showcase to 150–300+ builders</h2>
            <p>Reserve a stand in the Builders Market — right on the floor.</p>
          </div>
          <div className="tiers">
            {EXHIBITOR.map(([name, body, price], i) => (
              <article className={`tier${i === 0 ? " is-featured" : ""}`} key={name}>
                <h3>{name}</h3>
                <div className="price">
                  KES {price}
                  <small>per stand</small>
                </div>
                <ul>
                  <li>{body}</li>
                </ul>
                <Link className="btn btn--ghost btn--block" href="/partner#enquiry">
                  Reserve
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship */}
      {tiers.length > 0 && (
        <section className="section" id="sponsor">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Sponsorship</span>
              <h2>Back Kenya&apos;s clean-tech builders</h2>
              <p>Tailored packages — talk to us about aligning your brand with BuildFest 2026.</p>
            </div>
            <div className="tiers">
              {tiers.map((t) => (
                <article className={`tier${t.featured ? " is-featured" : ""}`} key={t.name}>
                  <h3>{t.name}</h3>
                  <div className="price">{t.price}</div>
                  <ul>
                    {t.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <Link
                    className={`btn ${t.featured ? "btn--primary" : "btn--ghost"} btn--block`}
                    href="/partner#enquiry"
                  >
                    Enquire
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {(galleryMedia.length > 0 || galleryAlbum) && (
        <section className="section" id="gallery">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Gallery</span>
              <h2>From the build floor</h2>
              <p>Photos and clips from BuildFest and the run-up to it.</p>
            </div>
            <PhotoWall
              media={galleryMedia}
              albumUrl={galleryAlbum}
              limit={6}
              label="BuildFest"
              moreLabel="See the full album"
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section section--tint">
        <div className="container newsletter">
          <span className="eyebrow">Built for Kenya. Built for Africa.</span>
          <h2>Are you a builder? A developer? A student with an idea?</h2>
          <p>
            BuildFest 2026 is your room. Register your team. Choose your track.
            Build something that matters.
          </p>
          <p style={{ marginTop: 20 }}>
            <Link className="btn btn--primary" href="/build-fest/register">
              Register Now
            </Link>{" "}
            <Link className="btn btn--ghost" href="/contact" style={{ marginLeft: 10 }}>
              Ask a question
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
