import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import Media from "@/components/site/Media";
import ProductCard from "@/components/shop/ProductCard";
import {
  getProductCategories,
  getFeaturedProducts,
  getPageImages,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Robotics kits, Arduino and microcontrollers, electronic components, sensors, 3D designs and power gear from Willary STEM — Nairobi, Kenya.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [categories, featured, pageImages] = await Promise.all([
    getProductCategories(),
    getFeaturedProducts(6),
    getPageImages(),
  ]);

  return (
    <>
      <PageHero bg={pageImages["shop_hero"]?.url}>
        <p className="breadcrumb">
          <Link href="/">Home</Link> » Shop
        </p>
        <h1>Willary Shop</h1>
        <p>
          Kits, boards, components and designs for your next build — with local
          delivery across Kenya.
        </p>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Browse</p>
            <h2>Shop by category</h2>
          </div>

          {categories.length === 0 ? (
            <p>The shop is being stocked — check back very soon.</p>
          ) : (
            <div className="grid grid--3">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/c/${c.slug}`}
                  className="card shop-cat-card"
                >
                  <Media src={c.imageUrl} label={c.name} variant="wide" />
                  <h3 style={{ marginTop: 14 }}>{c.name}</h3>
                  {c.summary && <p>{c.summary}</p>}
                  <span className="card-link">Browse →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Picks</p>
              <h2>Featured products</h2>
            </div>
            <div className="grid grid--3">
              {featured.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container newsletter">
          <p className="eyebrow">Need something specific?</p>
          <h2>Can&rsquo;t find a part?</h2>
          <p>
            Tell us what you need and we&rsquo;ll source it or point you the right
            way.
          </p>
          <p style={{ marginTop: 20 }}>
            <Link className="btn btn--primary" href="/contact">
              Get in touch
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
