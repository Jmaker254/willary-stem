import "server-only";
import { prisma } from "@/lib/db";
import type { Field } from "@/components/admin/ContentForm";
import {
  saveProject,
  saveEvent,
  saveVisit,
  saveSchool,
  saveSponsorTier,
  saveStat,
  saveTeamMember,
  saveTestimonial,
  savePartner,
  savePost,
  saveCohort,
} from "@/actions/admin/content";
import type { FormState } from "@/lib/form";

export type ContentKey =
  | "projects"
  | "events"
  | "visits"
  | "schools"
  | "sponsor-tiers"
  | "stats"
  | "team"
  | "testimonials"
  | "partners"
  | "posts"
  | "cohorts";

interface Entry {
  key: ContentKey;
  singular: string;
  plural: string;
  model:
    | "project"
    | "event"
    | "communityVisit"
    | "school"
    | "sponsorTier"
    | "siteStat"
    | "teamMember"
    | "testimonial"
    | "partner"
    | "post"
    | "cohort";
  canPublish: boolean;
  fields: Field[];
  columns: { header: string; get: (row: Record<string, unknown>) => string }[];
  list: () => Promise<Record<string, unknown>[]>;
  find: (id: string) => Promise<Record<string, unknown> | null>;
  save: (id: string | null, prev: FormState, fd: FormData) => Promise<FormState>;
}

const s = (v: unknown) => (v == null ? "" : String(v));

export const REGISTRY: Record<ContentKey, Entry> = {
  projects: {
    key: "projects",
    singular: "project",
    plural: "Projects",
    model: "project",
    canPublish: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", hint: "lowercase-with-hyphens; used in /lab#slug" },
      { name: "category", label: "Category", type: "select", options: ["ROBOT", "PCB", "IOT"] },
      { name: "summary", label: "Summary", type: "textarea", rows: 4 },
      { name: "body", label: "Body (Markdown, optional)", type: "textarea", rows: 8 },
      { name: "tech", label: "Tech tags", type: "list", hint: "One per line or comma-separated" },
      { name: "imageUrl", label: "Image or video", type: "media", hint: "Shown on the project. Upload or paste a URL." },
      { name: "featured", label: "Featured on the home page", type: "checkbox" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Title", get: (r) => s(r.title) },
      { header: "Category", get: (r) => s(r.category) },
      { header: "Featured", get: (r) => (r.featured ? "★" : "") },
    ],
    list: () => prisma.project.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }] }),
    find: (id) => prisma.project.findUnique({ where: { id } }),
    save: saveProject,
  },

  events: {
    key: "events",
    singular: "event",
    plural: "Events",
    model: "event",
    canPublish: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "dateText", label: "Date text", type: "text", hint: 'e.g. "Monthly" or "21 November 2026"' },
      { name: "status", label: "Status", type: "select", options: ["UPCOMING", "PAST"] },
      { name: "summary", label: "Summary", type: "textarea", rows: 4 },
      { name: "body", label: "Body (Markdown, optional)", type: "textarea", rows: 6 },
      {
        name: "statsJson",
        label: "Stats (JSON array, optional)",
        type: "textarea",
        rows: 3,
        hint: '[{"num":"267","label":"Sign-ups"}]',
      },
      {
        name: "videoUrl",
        label: "Feature video (optional)",
        type: "media",
        hint: "MP4/WebM upload or a YouTube/Vimeo link. Shown at the top of a past event.",
      },
      {
        name: "photos",
        label: "Photos & videos (slideshow)",
        type: "media-list",
        hint: "Upload or paste URLs. A few show on the page; the rest live in the album below.",
      },
      {
        name: "albumUrl",
        label: "Full album link (Google Photos, optional)",
        type: "url",
        hint: 'Adds a "See all photos →" button under the slideshow.',
      },
      {
        name: "posterUrl",
        label: "Full-screen poster (upcoming events)",
        type: "media",
        hint: "Portrait image. Fills the screen behind the BuildFest page as a fixed background.",
      },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Title", get: (r) => s(r.title) },
      { header: "When", get: (r) => s(r.dateText) },
      { header: "Status", get: (r) => s(r.status) },
    ],
    list: () => prisma.event.findMany({ orderBy: { order: "asc" } }),
    find: (id) => prisma.event.findUnique({ where: { id } }),
    save: saveEvent,
  },

  visits: {
    key: "visits",
    singular: "community visit",
    plural: "Community visits",
    model: "communityVisit",
    canPublish: true,
    fields: [
      { name: "label", label: "Label", type: "text", hint: 'e.g. "Visit I"' },
      { name: "place", label: "Place", type: "text", required: true },
      { name: "childrenCount", label: "Children reached (optional)", type: "number" },
      { name: "dateText", label: "Date text (optional)", type: "text" },
      { name: "summary", label: "Summary", type: "textarea", rows: 4 },
      {
        name: "photos",
        label: "Photos & videos",
        type: "media-list",
        hint: "A few show in the Impact gallery; link the full album below.",
      },
      {
        name: "albumUrl",
        label: "Full album link (Google Photos, optional)",
        type: "url",
      },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Label", get: (r) => s(r.label) },
      { header: "Place", get: (r) => s(r.place) },
      { header: "Children", get: (r) => s(r.childrenCount) },
    ],
    list: () => prisma.communityVisit.findMany({ orderBy: { order: "asc" } }),
    find: (id) => prisma.communityVisit.findUnique({ where: { id } }),
    save: saveVisit,
  },

  schools: {
    key: "schools",
    singular: "school",
    plural: "Schools",
    model: "school",
    canPublish: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "note", label: "Note (optional)", type: "textarea", rows: 3 },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Name", get: (r) => s(r.name) },
      { header: "Note", get: (r) => s(r.note).slice(0, 60) },
    ],
    list: () => prisma.school.findMany({ orderBy: { order: "asc" } }),
    find: (id) => prisma.school.findUnique({ where: { id } }),
    save: saveSchool,
  },

  "sponsor-tiers": {
    key: "sponsor-tiers",
    singular: "sponsor tier",
    plural: "Sponsor tiers",
    model: "sponsorTier",
    canPublish: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "price", label: "Price", type: "text", hint: 'e.g. "KES TBC" or "KES 250,000"' },
      { name: "benefits", label: "Benefits", type: "list", hint: "One per line" },
      { name: "featured", label: "Featured (highlighted card)", type: "checkbox" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Name", get: (r) => s(r.name) },
      { header: "Price", get: (r) => s(r.price) },
      { header: "Featured", get: (r) => (r.featured ? "★" : "") },
    ],
    list: () => prisma.sponsorTier.findMany({ orderBy: { order: "asc" } }),
    find: (id) => prisma.sponsorTier.findUnique({ where: { id } }),
    save: saveSponsorTier,
  },

  stats: {
    key: "stats",
    singular: "stat",
    plural: "Stats",
    model: "siteStat",
    canPublish: false,
    fields: [
      { name: "key", label: "Key", type: "text", hint: "lowercase_with_underscores; unique" },
      { name: "num", label: "Number", type: "text", hint: 'e.g. "66" or "1,000+"' },
      { name: "label", label: "Label", type: "text" },
      { name: "group", label: "Group", type: "select", options: ["home", "about", "partner"] },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Key", get: (r) => s(r.key) },
      { header: "Number", get: (r) => s(r.num) },
      { header: "Label", get: (r) => s(r.label) },
      { header: "Group", get: (r) => s(r.group) },
    ],
    list: () => prisma.siteStat.findMany({ orderBy: [{ group: "asc" }, { order: "asc" }] }),
    find: (id) => prisma.siteStat.findUnique({ where: { id } }),
    save: saveStat,
  },

  team: {
    key: "team",
    singular: "team member",
    plural: "Team",
    model: "teamMember",
    canPublish: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", hint: 'e.g. "Founder & Robotics Engineer"' },
      { name: "photoUrl", label: "Photo", type: "media", hint: "Square headshot works best." },
      { name: "bio", label: "Short bio", type: "textarea", rows: 3 },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Name", get: (r) => s(r.name) },
      { header: "Role", get: (r) => s(r.role) },
    ],
    list: () => prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    find: (id) => prisma.teamMember.findUnique({ where: { id } }),
    save: saveTeamMember,
  },

  testimonials: {
    key: "testimonials",
    singular: "testimonial",
    plural: "Testimonials",
    model: "testimonial",
    canPublish: true,
    fields: [
      { name: "quote", label: "Quote", type: "textarea", rows: 4, required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role / context", type: "text", hint: 'e.g. "Panelist" or "Attendee, Edition I"' },
      { name: "photoUrl", label: "Photo (optional)", type: "media" },
      {
        name: "eventTag",
        label: "Event tag",
        type: "text",
        hint: 'Which event this is about. Use "coffee-and-solder" to show it on the Events page.',
      },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Name", get: (r) => s(r.name) },
      { header: "Role", get: (r) => s(r.role) },
      { header: "Tag", get: (r) => s(r.eventTag) },
    ],
    list: () => prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    find: (id) => prisma.testimonial.findUnique({ where: { id } }),
    save: saveTestimonial,
  },

  partners: {
    key: "partners",
    singular: "partner",
    plural: "Partners",
    model: "partner",
    canPublish: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logoUrl", label: "Logo", type: "media", hint: "Transparent PNG/SVG works best." },
      { name: "url", label: "Website (optional)", type: "url" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Name", get: (r) => s(r.name) },
      { header: "Website", get: (r) => s(r.url) },
    ],
    list: () => prisma.partner.findMany({ orderBy: { order: "asc" } }),
    find: (id) => prisma.partner.findUnique({ where: { id } }),
    save: savePartner,
  },

  posts: {
    key: "posts",
    singular: "post",
    plural: "Blog & news",
    model: "post",
    canPublish: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", hint: "lowercase-with-hyphens; used in /blog/<slug>" },
      { name: "category", label: "Type", type: "select", options: ["blog", "news"] },
      { name: "excerpt", label: "Excerpt / summary", type: "textarea", rows: 3 },
      { name: "coverUrl", label: "Cover image", type: "media" },
      { name: "author", label: "Author (optional)", type: "text" },
      { name: "body", label: "Body (Markdown)", type: "textarea", rows: 16 },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order (rarely needed)", type: "number" },
    ],
    columns: [
      { header: "Title", get: (r) => s(r.title) },
      { header: "Type", get: (r) => s(r.category) },
      { header: "Published", get: (r) => (r.published ? "●" : "—") },
    ],
    list: () =>
      prisma.post.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] }),
    find: (id) => prisma.post.findUnique({ where: { id } }),
    save: savePost,
  },

  cohorts: {
    key: "cohorts",
    singular: "class cohort",
    plural: "Class cohorts",
    model: "cohort",
    canPublish: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "program", label: "Program", type: "text", hint: 'e.g. "Coding", "Robotics", "Electronics", "Bootcamp"' },
      { name: "mode", label: "Mode", type: "select", options: ["PHYSICAL", "ONLINE", "HYBRID"] },
      { name: "status", label: "Status", type: "select", options: ["OPEN", "UPCOMING", "FULL", "CLOSED"] },
      { name: "startText", label: "Start", type: "text", hint: 'e.g. "Starts Saturday, 10 January 2026"' },
      { name: "scheduleText", label: "Schedule", type: "text", hint: 'e.g. "Saturdays, 9–11 AM · 8 weeks"' },
      { name: "location", label: "Location (physical / hybrid)", type: "text" },
      { name: "ageRange", label: "Age range", type: "text", hint: 'e.g. "Ages 8–13"' },
      { name: "priceKes", label: "Price", type: "text", hint: 'e.g. "KES 6,000" or "Free"' },
      { name: "capacity", label: "Capacity (optional)", type: "number" },
      { name: "summary", label: "Summary", type: "textarea", rows: 3 },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
    columns: [
      { header: "Title", get: (r) => s(r.title) },
      { header: "Mode", get: (r) => s(r.mode) },
      { header: "Start", get: (r) => s(r.startText) },
      { header: "Status", get: (r) => s(r.status) },
    ],
    list: () => prisma.cohort.findMany({ orderBy: { order: "asc" } }),
    find: (id) => prisma.cohort.findUnique({ where: { id } }),
    save: saveCohort,
  },
};

/** Turn an event row's `stats` JSON back into the textarea string. */
export function prefill(
  key: ContentKey,
  row: Record<string, unknown> | null,
): Record<string, unknown> {
  if (!row) return {};
  if (key === "events") {
    return { ...row, statsJson: row.stats ? JSON.stringify(row.stats, null, 2) : "" };
  }
  return row;
}
