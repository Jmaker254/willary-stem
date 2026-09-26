"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartButton() {
  const { count, ready } = useCart();
  return (
    <Link className="btn btn--ghost btn--sm nav-cart" href="/shop/cart" aria-label="Cart">
      <span aria-hidden>🛒</span> Cart
      {ready && count > 0 && (
        <span className="nav-badge" aria-hidden>
          {count}
        </span>
      )}
    </Link>
  );
}
