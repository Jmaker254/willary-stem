import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: post.coverUrl ? [{ url: post.coverUrl }] : undefined,
    },
  };
}

function fmt(d?: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.willaryrobotics.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": post.category === "news" ? "NewsArticle" : "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? undefined,
    author: { "@type": "Organization", name: post.author ?? "Willary STEM" },
    publisher: { "@type": "Organization", name: "Willary STEM Robotics" },
    mainEntityOfPage: `${site}/blog/${post.slug}`,
    image: post.coverUrl ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » <Link href="/blog">Blog &amp; news</Link>{" "}
            » {post.title}
          </p>
          <h1>{post.title}</h1>
          <p>
            {[
              post.category === "news" ? "Tech news" : "Blog",
              post.author,
              fmt(post.publishedAt),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {post.coverUrl && (
            <div className="post-cover">
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                sizes="(max-width: 820px) 100vw, 820px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          )}
          <article
            className="prose post-body"
            style={{ margin: "0 auto" }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />
          <p style={{ textAlign: "center", marginTop: 40 }}>
            <Link className="btn btn--ghost" href="/blog">
              ← All posts
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
