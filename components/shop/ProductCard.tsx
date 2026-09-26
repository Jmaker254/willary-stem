import Link from "next/link";
import Media from "@/components/site/Media";
import type { Product } from "@/lib/types";
import { formatKes } from "@/lib/money";

export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="card product-card">
      <Link href={`/shop/${p.slug}`} className="product-card-media">
        <Media src={p.imageUrl} label={p.name} variant="wide" />
      </Link>
      <div className="product-card-body">
        {p.categoryName && (
          <ul className="chips">
            <li>{p.categoryName}</li>
          </ul>
        )}
        <h3 style={{ marginTop: 10 }}>
          <Link href={`/shop/${p.slug}`}>{p.name}</Link>
        </h3>
        <p>{p.summary}</p>
        <p className="product-price">
          {formatKes(p.priceKes)}
          {p.compareKes && p.compareKes > p.priceKes && (
            <span className="product-was">{formatKes(p.compareKes)}</span>
          )}
          {p.status === "SOLD_OUT" && (
            <span className="product-flag">Sold out</span>
          )}
          {p.status === "COMING_SOON" && (
            <span className="product-flag">Coming soon</span>
          )}
        </p>
        <Link href={`/shop/${p.slug}`} className="card-link">
          View →
        </Link>
      </div>
    </article>
  );
}
