import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "@/components/site/Media";
import Gallery from "@/components/site/Gallery";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { getProduct } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { formatKes } from "@/lib/money";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.summary,
      url: `/shop/${product.slug}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

const STATUS_LABEL: Record<string, string> = {
  SOLD_OUT: "Sold out",
  COMING_SOON: "Coming soon",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const gallery = [product.imageUrl, ...product.images].filter(
    (v, i, a): v is string => Boolean(v) && a.indexOf(v) === i,
  );
  const buyable = product.status === "AVAILABLE";

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.willaryrobotics.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: gallery.length ? gallery : undefined,
    sku: product.sku ?? undefined,
    category: product.categoryName ?? undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product.priceKes,
      availability: buyable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site}/shop/${product.slug}`,
    },
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
            <Link href="/">Home</Link> » <Link href="/shop">Shop</Link>
            {product.categorySlug && product.categoryName && (
              <>
                {" "}
                » <Link href={`/shop/c/${product.categorySlug}`}>{product.categoryName}</Link>
              </>
            )}{" "}
            » {product.name}
          </p>
          <h1>{product.name}</h1>
          <p>{product.summary}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="product-detail">
            <div className="product-detail-media">
              {gallery.length > 1 ? (
                <Gallery media={gallery} label={product.name} limit={6} />
              ) : (
                <Media
                  src={product.imageUrl}
                  label={product.name}
                  variant="wide"
                  priority
                />
              )}
            </div>

            <div className="product-detail-buy">
              {product.categoryName && (
                <ul className="chips">
                  <li>{product.categoryName}</li>
                </ul>
              )}
              <p className="product-price product-price--lg">
                {formatKes(product.priceKes)}
                {product.compareKes && product.compareKes > product.priceKes && (
                  <span className="product-was">
                    {formatKes(product.compareKes)}
                  </span>
                )}
              </p>

              {!buyable && (
                <p className="product-flag" style={{ display: "inline-block" }}>
                  {STATUS_LABEL[product.status] ?? "Unavailable"}
                </p>
              )}

              {buyable && !!product.stockQty && product.stockQty > 0 && (
                <p className="form-note">{product.stockQty} in stock</p>
              )}

              <div style={{ marginTop: 18 }}>
                <AddToCartButton
                  product={{
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    priceKes: product.priceKes,
                    imageUrl: product.imageUrl,
                  }}
                  disabled={!buyable}
                />
              </div>

              <p className="form-note" style={{ marginTop: 14 }}>
                Checkout places an order request — we confirm stock and payment
                by email or phone.
              </p>
            </div>
          </div>

          {product.body && (
            <article
              className="prose"
              style={{ marginTop: 48 }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(product.body) }}
            />
          )}

          <p style={{ marginTop: 40 }}>
            <Link className="btn btn--ghost" href="/shop">
              ← Back to the shop
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
