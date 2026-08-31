import Link from "next/link";

export const metadata = { title: "Subscription confirmed" };

export default function Confirmed() {
  return (
    <section className="section">
      <div className="container newsletter">
        <span className="eyebrow">Newsletter</span>
        <h1>You&apos;re subscribed 🎉</h1>
        <p>
          Thanks for confirming. You&apos;ll hear from Willary STEM when
          there&apos;s something worth sharing.
        </p>
        <p style={{ marginTop: 20 }}>
          <Link className="btn btn--primary" href="/">
            Back to home
          </Link>
        </p>
      </div>
    </section>
  );
}
