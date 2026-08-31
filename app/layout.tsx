import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.willaryrobotics.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Willary STEM — Building Problem-Solvers, Not Certificate Holders",
    template: "%s — Willary STEM",
  },
  description:
    "Nairobi-based STEM education and robotics company. School workshops, robot builds, custom PCB and IoT deployments, community robot visits, and Willary BuildFest 2026.",
  applicationName: "Willary STEM",
  keywords: [
    "STEM Kenya",
    "robotics Nairobi",
    "coding workshops schools",
    "PCB design Kenya",
    "IoT Kenya",
    "Willary BuildFest 2026",
    "clean technology hackathon Nairobi",
  ],
  authors: [{ name: "Willary STEM Robotics" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Willary STEM",
    locale: "en_KE",
    url: SITE_URL,
    title: "Willary STEM — Building Problem-Solvers, Not Certificate Holders",
    description:
      "School workshops, robot builds, custom PCB & IoT, community robot visits, and Willary BuildFest 2026 — Nairobi, Kenya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Willary STEM",
    description:
      "Nairobi STEM education & robotics. Workshops, builds, and Willary BuildFest 2026.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Willary STEM Robotics",
  alternateName: "Willary STEM",
  url: SITE_URL,
  areaServed: "KE",
  email: "willarystemrobotics@gmail.com",
  telephone: "+254796815446",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  founder: { "@type": "Person", name: "William Otwola" },
  sameAs: [
    "https://www.tiktok.com/@willarystemrobotics1",
    "https://www.instagram.com/willarystemrobotics1",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
