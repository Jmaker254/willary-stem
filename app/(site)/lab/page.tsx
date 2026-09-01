import type { Metadata } from "next";
import Link from "next/link";
import Media from "@/components/site/Media";
import PageHero from "@/components/site/PageHero";
import { getProjects, getPageImages } from "@/lib/content";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Robotics & Innovation Lab",
  description:
    "Original robot builds, custom PCB design, and deployed IoT systems from Willary STEM — WillaryBot, SHGR, Willary BASE BOARD, AquaVend, Adano Farm irrigation and more.",
};

const SECTIONS: { key: Project["category"]; eyebrow: string; heading: string }[] =
  [
    { key: "ROBOT", eyebrow: "Robot Builds", heading: "Robots designed and built in-house" },
    { key: "PCB", eyebrow: "Custom PCB & Hardware", heading: "Board design and fabrication" },
    { key: "IOT", eyebrow: "IoT Deployments", heading: "Systems running in the field" },
  ];

export default async function LabPage() {
  const [projects, pageImages] = await Promise.all([
    getProjects(),
    getPageImages(),
  ]);
  const heroBg = pageImages["lab_hero"]?.url || null;

  return (
    <>
      <PageHero bg={heroBg}>
        <p className="breadcrumb">
          <Link href="/">Home</Link> » Robotics &amp; Innovation Lab
        </p>
        <h1>Robotics &amp; Innovation Lab</h1>
        <p>
          The proof-of-work. Original robots, custom circuit boards, and IoT
          systems that are actually deployed and running in the field.
        </p>
      </PageHero>

      {SECTIONS.map((sec, i) => {
        const items = projects.filter((p) => p.category === sec.key);
        if (items.length === 0) return null;
        return (
          <section
            key={sec.key}
            className={`section${i % 2 === 1 ? " section--alt" : ""}`}
          >
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">{sec.eyebrow}</span>
                <h2>{sec.heading}</h2>
              </div>
              {sec.key === "IOT" ? (
                <div className="grid grid--3">
                  {items.map((p) => (
                    <article className="card" key={p.slug} id={p.slug}>
                      <h3>{p.title}</h3>
                      <p>{p.summary}</p>
                      {p.tech.length > 0 && (
                        <ul className="chips">
                          {p.tech.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                items.map((p) => (
                  <div className="project" key={p.slug} id={p.slug}>
                    <Media src={p.imageUrl} label={p.title} />
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.summary}</p>
                      {p.tech.length > 0 && (
                        <ul className="chips">
                          {p.tech.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        );
      })}

      <section className="section section--tint">
        <div className="container newsletter">
          <span className="eyebrow">Build With Us</span>
          <h2>Need hardware, a robot, or an IoT system built?</h2>
          <p>
            Willary STEM takes on custom PCB design, embedded firmware, and
            end-to-end IoT deployments for schools and organisations.
          </p>
          <p style={{ marginTop: 20 }}>
            <Link className="btn btn--primary" href="/contact">
              Start a project
            </Link>{" "}
            <Link
              className="btn btn--ghost"
              href="/partner"
              style={{ marginLeft: 10 }}
            >
              Partner With Us
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
