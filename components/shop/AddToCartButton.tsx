"use client";

import { useState } from "react";
import { useCart, type CartItem } from "./CartProvider";

export default function AddToCartButton({
  product,
  className = "btn btn--primary",
  disabled = false,
}: {
  product: Omit<CartItem, "quantity">;
  className?: string;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <button type="button" className={className} disabled>
        Unavailable
      </button>
    );
  }

  return (
    <span className="shop-add">
      <span className="shop-qty" aria-label="Quantity">
        <button
          type="button"
          className="btn-link"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span>{qty}</span>
        <button
          type="button"
          className="btn-link"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
        >
          +
        </button>
      </span>
      <button
        type="button"
        className={className}
        onClick={() => {
          add(product, qty);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
    </span>
  );
}
