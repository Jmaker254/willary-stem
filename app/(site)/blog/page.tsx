import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog & Tech News",
  description:
    "Build notes, ideas, and technology news from Willary STEM — robotics, hardware, IoT and STEM education in Kenya.",
  alternates: { canonical: "/blog" },
};

function fmt(d?: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const category = type === "news" || type === "blog" ? type : undefined;
  const posts = await getPosts(category);

  const tabs = [
    { key: undefined, label: "All", href: "/blog" },
    { key: "blog", label: "Blog", href: "/blog?type=blog" },
    { key: "news", label: "Tech news", href: "/blog?type=news" },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » Blog &amp; news
          </p>
          <h1>Blog &amp; Tech News</h1>
          <p>Build notes, ideas, and technology news from the Willary bench.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-filters" style={{ marginBottom: 28 }}>
            {tabs.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                aria-current={category === t.key ? "true" : undefined}
              >
                {t.label}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <p>Nothing published yet — check back soon.</p>
          ) : (
            <div className="grid grid--3">
              {posts.map((p) => (
                <article className="card post-card" key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="post-card-cover">
                    {p.coverUrl ? (
                      <Image
                        src={p.coverUrl}
                        alt={p.title}
                        fill
                        sizes="(max-width: 960px) 100vw, 360px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span>{p.category === "news" ? "Tech news" : "Blog"}</span>
                    )}
                  </Link>
                  <div className="post-card-body">
                    <ul className="chips">
                      <li>{p.category === "news" ? "Tech news" : "Blog"}</li>
                    </ul>
                    <h3 style={{ marginTop: 10 }}>
                      <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p>{p.excerpt}</p>
                    <p className="form-note">
                      {[p.author, fmt(p.publishedAt)].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
