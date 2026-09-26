"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { formatKes } from "@/lib/money";

export default function CartView() {
  const { items, subtotalKes, setQty, remove, ready } = useCart();

  if (!ready) return <p>Loading your cart…</p>;

  if (items.length === 0) {
    return (
      <div className="panel">
        <p>Your cart is empty.</p>
        <p style={{ marginTop: 12 }}>
          <Link className="btn btn--primary" href="/shop">
            Browse the shop
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="cart">
      <ul className="cart-lines">
        {items.map((i) => (
          <li className="cart-line" key={i.productId}>
            <Link href={`/shop/${i.slug}`} className="cart-line-media">
              {i.imageUrl ? (
                <Image
                  src={i.imageUrl}
                  alt={i.name}
                  fill
                  sizes="80px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <span aria-hidden>📦</span>
              )}
            </Link>
            <div className="cart-line-body">
              <Link href={`/shop/${i.slug}`} className="cart-line-name">
                {i.name}
              </Link>
              <p className="form-note">{formatKes(i.priceKes)} each</p>
              <div className="shop-qty">
                <button
                  type="button"
                  className="btn-link"
                  aria-label="Decrease quantity"
                  onClick={() => setQty(i.productId, i.quantity - 1)}
                >
                  −
                </button>
                <span>{i.quantity}</span>
                <button
                  type="button"
                  className="btn-link"
                  aria-label="Increase quantity"
                  onClick={() => setQty(i.productId, i.quantity + 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="btn-link cart-remove"
                  onClick={() => remove(i.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="cart-line-total">
              {formatKes(i.priceKes * i.quantity)}
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary panel">
        <div className="cart-subtotal">
          <span>Subtotal</span>
          <strong>{formatKes(subtotalKes)}</strong>
        </div>
        <p className="form-note">
          Delivery and payment are arranged after you place the request.
        </p>
        <Link className="btn btn--primary btn--block" href="/shop/checkout">
          Proceed to checkout
        </Link>
        <Link className="btn btn--ghost btn--block" href="/shop" style={{ marginTop: 10 }}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
