import Link from "next/link";

export const metadata = { title: "Unsubscribed" };

export default function Unsubscribed() {
  return (
    <section className="section">
      <div className="container newsletter">
        <span className="eyebrow">Newsletter</span>
        <h1>You&apos;ve been unsubscribed</h1>
        <p>
          You won&apos;t receive any more newsletters from Willary STEM. You can
          resubscribe any time from the site footer.
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
