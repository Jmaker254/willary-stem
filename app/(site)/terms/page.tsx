import Link from "next/link";

export const metadata = { title: "Terms & Conditions" };

export default function Terms() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> » Terms
          </p>
          <h1>Terms &amp; Conditions</h1>
          <p>Placeholder — replace with your reviewed terms before launch.</p>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p>
            This page is a placeholder. Add your terms of service, event terms
            (Build Fest tickets, refunds), and workshop engagement terms here.
          </p>
        </div>
      </section>
    </>
  );
}
