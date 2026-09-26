import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/site/PageHero";
import ProductCard from "@/components/shop/ProductCard";
import {
  getProductCategory,
  getProducts,
  getPageImages,
} from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getProductCategory(category);
  if (!cat) return { title: "Category not found" };
  return {
    title: `${cat.name} — Shop`,
    description: cat.summary ?? `${cat.name} from the Willary STEM shop.`,
    alternates: { canonical: `/shop/c/${cat.slug}` },
  };
}

export default async function ShopCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [cat, pageImages] = await Promise.all([
    getProductCategory(category),
    getPageImages(),
  ]);
  if (!cat) notFound();

  const products = await getProducts(cat.slug);

  return (
    <>
      <PageHero bg={pageImages["shop_hero"]?.url}>
        <p className="breadcrumb">
          <Link href="/">Home</Link> » <Link href="/shop">Shop</Link> » {cat.name}
        </p>
        <h1>{cat.name}</h1>
        {cat.summary && <p>{cat.summary}</p>}
      </PageHero>

      <section className="section">
        <div className="container">
          {products.length === 0 ? (
            <p>
              Nothing in this category yet —{" "}
              <Link href="/shop">back to the shop</Link>.
            </p>
          ) : (
            <div className="grid grid--3">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}

          <p style={{ marginTop: 40 }}>
            <Link className="btn btn--ghost" href="/shop">
              ← All categories
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
