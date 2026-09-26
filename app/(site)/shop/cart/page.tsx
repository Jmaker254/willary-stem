import type { Metadata } from "next";
import Link from "next/link";
import CartView from "@/components/shop/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your Willary STEM shop cart.",
  alternates: { canonical: "/shop/cart" },
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » <Link href="/shop">Shop</Link> » Cart
          </p>
          <h1>Your cart</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CartView />
        </div>
      </section>
    </>
  );
}
