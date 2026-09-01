import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Slideshow from "@/components/site/Slideshow";
import Testimonials from "@/components/site/Testimonials";
import ComingSoonButton from "@/components/site/ComingSoonButton";
import { ticketsLive } from "@/lib/flags";
import { embedUrl, isVideoUrl } from "@/lib/media";
import {
  getEvents,
  getSettings,
  getTestimonials,
  getPageImages,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Coffee & Solder monthly meetups, World Robot Competition Nairobi, and Willary BuildFest 2026 — the events Willary STEM runs for Kenya's maker community.",
};

export default async function EventsPage() {
  const [events, settings, csTestimonials, pageImages] = await Promise.all([
    getEvents(),
    getSettings(),
    getTestimonials("coffee-and-solder"),
    getPageImages(),
  ]);
  const upcoming = events.filter((e) => e.status === "UPCOMING");
  const past = events.filter((e) => e.status === "PAST");
  const heroBg = pageImages["events_hero"]?.url || null;

  return (
    <>
      <section
        className={`page-hero${heroBg ? " has-bg" : ""}`}
        style={heroBg ? { backgroundImage: `url(${heroBg})` } : undefined}
      >
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » Events
          </p>
          <h1>Events</h1>
          <p>
            Willary STEM runs the gatherings where Nairobi&apos;s builders meet,
            compete, and show their work.
          </p>
        </div>
      </section>

      {/* Upcoming — animated */}
      {upcoming.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Coming Up</span>
              <h2>What&apos;s next</h2>
            </div>
            {upcoming.map((e) => (
              <div className="event-upcoming" key={e.slug}>
                <div className="event-upcoming-inner cta-band">
                  <span className="live-badge">
                    <span className="live-dot" /> Upcoming
                  </span>
                  <h2>{e.title}</h2>
                  <p>{e.summary}</p>
                  {e.stats.length > 0 && (
                    <div className="event-countdown">
                      {e.stats.map((s) => (
                        <div className="count-cell" key={s.label}>
                          <div className="count-num">{s.num}</div>
                          <div className="count-lbl">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {(e.posterUrl || e.photos[0]) && (
                    <div className="event-upcoming-poster">
                      <Image
                        src={(e.posterUrl || e.photos[0])!}
                        alt={`${e.title} poster`}
                        width={420}
                        height={560}
                        sizes="(max-width: 620px) 80vw, 320px"
                      />
                    </div>
                  )}
                  <p style={{ marginTop: 20 }}>
                    {e.slug === "build-fest-2026" ? (
                      <>
                        <Link className="btn btn--light" href="/build-fest">
                          Full details
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
                      </>
                    ) : (
                      <Link className="btn btn--light" href="/contact">
                        Register interest
                      </Link>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past — photo slideshows */}
      {past.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Been There</span>
              <h2>Past editions</h2>
            </div>
            <div className="past-events">
              {past.map((e, i) => (
                <article
                  className={`past-event highlight${i % 2 === 1 ? " past-event--flip" : ""}`}
                  key={e.slug}
                >
                  <div className="past-event-media">
                    {e.videoUrl ? (
                      embedUrl(e.videoUrl) ? (
                        <div className="event-video">
                          <iframe
                            src={embedUrl(e.videoUrl)!}
                            title={`${e.title} video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : isVideoUrl(e.videoUrl) ? (
                        <div className="event-video">
                          <video src={e.videoUrl} controls playsInline />
                        </div>
                      ) : (
                        <Slideshow
                          photos={e.photos}
                          label={e.title}
                          limit={6}
                          albumUrl={e.albumUrl ?? settings.photosAlbumUrl}
                        />
                      )
                    ) : (
                      <Slideshow
                          photos={e.photos}
                          label={e.title}
                          limit={6}
                          albumUrl={e.albumUrl ?? settings.photosAlbumUrl}
                        />
                    )}
                  </div>
                  <div className="past-event-body">
                    <span className="eyebrow">{e.dateText}</span>
                    <h3 style={{ fontSize: "1.5rem" }}>{e.title}</h3>
                    <p>{e.summary}</p>
                    {e.stats.length > 0 && (
                      <div className="stat-badges">
                        {e.stats.map((s) => (
                          <div className="stat-badge" key={s.label}>
                            <div className="num">{s.num}</div>
                            <div className="lbl">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p style={{ marginTop: 20 }} className="hero-cta">
                      {(e.albumUrl || settings.photosAlbumUrl) && (
                        <a
                          className="btn btn--primary"
                          href={e.albumUrl || settings.photosAlbumUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          See all photos →
                        </a>
                      )}
                      <Link className="btn btn--ghost" href="/contact">
                        Get on the invite list
                      </Link>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* A word from peers, panelists & attendees — Coffee & Solder */}
      {csTestimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">A word from the room</span>
              <h2>Peers, panelists &amp; attendees on Coffee &amp; Solder</h2>
            </div>
            <Testimonials items={csTestimonials} />
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Calendar</span>
            <h2>What&apos;s happened &amp; what&apos;s next</h2>
          </div>
          <div className="timeline">
            {events.map((e) => (
              <div className="timeline-item" key={e.slug}>
                <div className="when">
                  {e.status === "UPCOMING" ? e.dateText : "Done"}
                </div>
                <h3>{e.title}</h3>
                <p>{e.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container newsletter">
          <span className="eyebrow">Sponsor an Event</span>
          <h2>Put your brand in front of Kenya&apos;s builders</h2>
          <p style={{ marginTop: 16 }}>
            <Link className="btn btn--primary" href="/partner">
              Partner With Us
            </Link>{" "}
            <Link className="btn btn--ghost" href="/contact" style={{ marginLeft: 10 }}>
              Contact
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
