import type { Metadata } from "next";
import Link from "next/link";
import PhotoWall from "@/components/site/PhotoWall";
import { getCommunityVisits, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Community Impact",
  description:
    "Willary STEM takes robots into communities across Nairobi. 66 children reached at Smile Community Centre, Soweto Kayole — on the way to 1,000+.",
};

export default async function ImpactPage() {
  const [visits, settings] = await Promise.all([
    getCommunityVisits(),
    getSettings(),
  ]);
  const albumUrl =
    visits.find((v) => v.albumUrl)?.albumUrl || settings.photosAlbumUrl;
  const media = visits.flatMap((v) => v.photos);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » Community Impact
          </p>
          <h1>Community Impact</h1>
          <p>
            Robots don&apos;t only belong in well-resourced schools. We take them
            to community centres and estates where children have never had
            hands-on access.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container highlight">
          <div>
            <span className="eyebrow">Robot Visits</span>
            <h2>Hands-on robotics, brought to the neighbourhood</h2>
            <p>
              Each visit brings working robots, hands-on stations, and a demo
              children can touch, drive, and ask questions about. The aim is
              simple: spark the moment a child realises they could build this
              too.
            </p>
            <p>
              Our first visit reached{" "}
              <strong>
                66 children at Smile Community Centre in Soweto, Kayole
              </strong>
              . We&apos;re building toward <strong>1,000+ children</strong>{" "}
              reached through community visits.
            </p>
            <Link className="btn btn--primary" href="/partner">
              Sponsor a visit
            </Link>
          </div>
          <div>
            <div className="statrow statrow--2">
              <div>
                <div className="num">66</div>
                <div className="lbl">Children reached (first visit)</div>
              </div>
              <div>
                <div className="num">1,000+</div>
                <div className="lbl">Children — our goal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">From the Visits</span>
            <h2>Photos &amp; videos</h2>
            <p>A few moments from the community robot visits.</p>
          </div>
          <PhotoWall
            media={media}
            albumUrl={albumUrl}
            limit={6}
            label="Community visit"
            moreLabel="See the full album"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Visit Log</span>
            <h2>Where we&apos;ve been</h2>
          </div>
          <div className="timeline">
            {visits.map((v) => (
              <div className="timeline-item" key={v.label}>
                <div className="when">{v.label}</div>
                <h3>{v.place}</h3>
                <p>{v.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container newsletter">
          <span className="eyebrow">Help Us Get to 1,000</span>
          <h2>Sponsor a community robot visit</h2>
          <p>
            A sponsored visit puts working robots in front of a room full of
            children who&apos;ve never touched one. Corporate and individual
            sponsors welcome.
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
