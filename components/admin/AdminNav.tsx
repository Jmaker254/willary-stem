"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";

const LINKS = [
  { group: "Leads", items: [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/submissions", label: "Submissions" },
    { href: "/admin/registrations", label: "Build Fest" },
    { href: "/admin/cohort-bookings", label: "Class bookings" },
    { href: "/admin/subscribers", label: "Subscribers" },
  ]},
  { group: "Content", items: [
    { href: "/admin/media", label: "Media library" },
    { href: "/admin/content/posts", label: "Blog & news" },
    { href: "/admin/content/cohorts", label: "Class cohorts" },
    { href: "/admin/content/projects", label: "Projects" },
    { href: "/admin/content/events", label: "Events" },
    { href: "/admin/content/visits", label: "Community visits" },
    { href: "/admin/content/schools", label: "Schools" },
    { href: "/admin/content/sponsor-tiers", label: "Sponsor tiers" },
    { href: "/admin/content/partners", label: "Partners" },
    { href: "/admin/content/team", label: "Team" },
    { href: "/admin/content/testimonials", label: "Testimonials" },
    { href: "/admin/content/stats", label: "Stats" },
    { href: "/admin/images", label: "Page images" },
    { href: "/admin/settings", label: "Settings" },
  ]},
];

export default function AdminNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const current = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="admin-side">
      <Link className="brand" href="/admin">
        <span className="mark" aria-hidden>⬡</span> Willary Admin
      </Link>

      {LINKS.map((section) => (
        <div key={section.group}>
          <div className="group-label">{section.group}</div>
          {section.items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={current(it.href, it.exact) ? "page" : undefined}
            >
              {it.label}
            </Link>
          ))}
        </div>
      ))}

      {role === "ADMIN" && (
        <div>
          <div className="group-label">Admin</div>
          <Link
            href="/admin/users"
            aria-current={current("/admin/users") ? "page" : undefined}
          >
            Staff &amp; roles
          </Link>
        </div>
      )}

      <div className="spacer" />
      <Link href="/" target="_blank">
        View site ↗
      </Link>
    </nav>
  );
}
