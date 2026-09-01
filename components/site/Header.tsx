"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/lab", label: "Lab" },
  { href: "/impact", label: "Impact" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/partner", label: "Partner" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  siteName,
  logoUrl,
}: {
  siteName: string;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="brand-logo" src={logoUrl} alt={siteName} />
          ) : (
            <>
              <span className="mark" aria-hidden>
                ⬡
              </span>{" "}
              {siteName}
            </>
          )}
        </Link>
        <nav>
          <ul className={`nav-links${open ? " open" : ""}`}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <Link className="btn btn--primary always nav-cta" href="/build-fest">
            BuildFest 2026
            <span className="nav-badge" aria-hidden>
              New
            </span>
          </Link>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
