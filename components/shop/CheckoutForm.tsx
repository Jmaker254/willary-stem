"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { requestOrder } from "@/actions/shop";
import { ORDER_IDLE } from "@/lib/shop-state";
import SubmitButton from "@/components/forms/SubmitButton";
import { useCart } from "./CartProvider";
import { formatKes } from "@/lib/money";

export default function CheckoutForm() {
  const [state, action] = useActionState(requestOrder, ORDER_IDLE);
  const { items, subtotalKes, clear, ready } = useCart();

  useEffect(() => {
    if (state.status === "done") clear();
  }, [state.status, clear]);

  if (state.status === "done") {
    return (
      <div className="panel" role="status">
        <h2 style={{ marginTop: 0 }}>Order {state.ref} received</h2>
        <p>
          Thanks! We&rsquo;ve emailed a copy to <strong>{state.email}</strong> and
          our team will confirm stock and payment details with you shortly.
          Nothing has been charged yet.
        </p>
        <p className="form-note">Subtotal: {formatKes(state.subtotalKes)}</p>
        <p style={{ marginTop: 16 }}>
          <Link className="btn btn--primary" href="/shop">
            Back to the shop
          </Link>
        </p>
      </div>
    );
  }

  if (ready && items.length === 0) {
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

  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};
  const cartJson = JSON.stringify(
    items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
  );

  return (
    <div className="checkout-grid">
      <form action={action} className="form-card">
        <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>Your details</h2>

        <div className="hp-field" aria-hidden>
          <label>
            Leave this empty
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <input type="hidden" name="cart" value={cartJson} />

        <div className="field">
          <label htmlFor="co-name">Full name</label>
          <input id="co-name" name="name" required />
          {fe.name && <p className="field-error">{fe.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="co-email">Email</label>
          <input id="co-email" type="email" name="email" required />
          {fe.email && <p className="field-error">{fe.email}</p>}
        </div>
        <div className="field">
          <label htmlFor="co-phone">Phone / WhatsApp</label>
          <input
            id="co-phone"
            name="phone"
            inputMode="tel"
            placeholder="07XX XXX XXX"
            required
          />
          {fe.phone && <p className="field-error">{fe.phone}</p>}
        </div>
        <div className="field">
          <label htmlFor="co-address">Delivery address / pickup note (optional)</label>
          <textarea id="co-address" name="address" rows={2} />
        </div>
        <div className="field">
          <label htmlFor="co-notes">Anything else? (optional)</label>
          <textarea id="co-notes" name="notes" rows={3} />
        </div>

        <SubmitButton className="btn btn--primary btn--block" pendingText="Placing order…">
          Place order request
        </SubmitButton>
        {state.status === "error" && (
          <p className="form-feedback is-error" role="status">
            {state.message}
          </p>
        )}
        <p className="form-note">
          This is an order request — we confirm stock and payment by email or
          phone. Nothing is charged now.
        </p>
      </form>

      <aside className="panel checkout-summary">
        <h3 style={{ marginTop: 0 }}>Order summary</h3>
        <ul className="checkout-items">
          {items.map((i) => (
            <li key={i.productId}>
              <span>
                {i.quantity} × {i.name}
              </span>
              <span>{formatKes(i.priceKes * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="cart-subtotal">
          <span>Subtotal</span>
          <strong>{formatKes(subtotalKes)}</strong>
        </div>
        <p style={{ marginTop: 12 }}>
          <Link className="btn btn--ghost btn--sm" href="/shop/cart">
            Edit cart
          </Link>
        </p>
      </aside>
    </div>
  );
}
