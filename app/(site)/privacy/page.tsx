import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » Privacy
          </p>
          <h1>Privacy Policy</h1>
          <p>Placeholder — replace with your reviewed policy before launch.</p>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p>
            This page is a placeholder. Describe what personal data Willary STEM
            collects through its forms (name, email, phone, organisation), how it
            is stored (a private database), how long it is kept, and how someone
            can request deletion. Add newsletter consent and unsubscribe details.
          </p>
        </div>
      </section>
    </>
  );
}
