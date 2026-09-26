import type { Metadata } from "next";
import Link from "next/link";
import CheckoutForm from "@/components/shop/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Place your Willary STEM shop order request.",
  alternates: { canonical: "/shop/checkout" },
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » <Link href="/shop">Shop</Link> »{" "}
            <Link href="/shop/cart">Cart</Link> » Checkout
          </p>
          <h1>Checkout</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CheckoutForm />
        </div>
      </section>
    </>
  );
}
