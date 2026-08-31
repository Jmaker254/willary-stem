import { z } from "zod";

const str = (max = 500) => z.string().trim().min(1).max(max);
const optStr = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const contactSchema = z.object({
  name: str(120),
  email: z.string().trim().email().max(200),
  topic: optStr(200),
  message: str(5000),
});

export const partnerSchema = z.object({
  organisation: str(200),
  name: str(120),
  email: z.string().trim().email().max(200),
  topic: optStr(200),
  message: str(5000),
});

export const buildFestEnquirySchema = z.object({
  name: str(120),
  email: z.string().trim().email().max(200),
  organisation: optStr(200),
  topic: optStr(200),
  message: str(5000),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(200),
  name: optStr(120),
  source: optStr(60),
});

export const TICKET_TYPES = [
  "STUDENT",
  "GENERAL",
  "TEAM",
  "SCHOOL_GROUP",
  "EXHIBITOR",
] as const;

/** Ticket types that are billed per team member and need a roster. */
export const TEAM_TICKETS = ["TEAM", "SCHOOL_GROUP"] as const;

/** Min/max people for the team ticket types. */
export const TEAM_LIMITS: Record<string, { min: number; max: number }> = {
  TEAM: { min: 1, max: 5 }, // Main Challenge
  SCHOOL_GROUP: { min: 1, max: 20 }, // Junior Builder Programme
};

export function isTeamTicket(t: string): boolean {
  return (TEAM_TICKETS as readonly string[]).includes(t);
}

export const registrationSchema = z.object({
  ticketType: z.enum(TICKET_TYPES),
  name: str(120),
  email: z.string().trim().email().max(200),
  phone: z
    .string()
    .trim()
    .min(9, "Enter the Safaricom number to bill (e.g. 0796 815 446)")
    .max(20),
  organisation: optStr(200),
  trackInterest: optStr(80),
  teamName: optStr(120),
  teamSize: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === "" || v === null) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? Math.trunc(n) : NaN;
    })
    .refine((v) => v === undefined || (v >= 1 && v <= 200), {
      message: "Enter a group size between 1 and 200",
    }),
  notes: optStr(3000),
});

// --- Admin content schemas ---

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  title: str(160),
  category: z.enum(["ROBOT", "PCB", "IOT"]),
  summary: str(1200),
  body: optStr(20000),
  tech: z.string().trim().max(600).optional().default(""),
  imageUrl: optStr(600),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const eventSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  title: str(160),
  dateText: str(80),
  status: z.enum(["PAST", "UPCOMING"]),
  summary: str(1200),
  body: optStr(20000),
  statsJson: optStr(4000),
  photos: z.string().trim().max(8000).optional().default(""),
  videoUrl: optStr(600),
  albumUrl: optStr(600),
  posterUrl: optStr(600),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const visitSchema = z.object({
  label: str(60),
  place: str(200),
  childrenCount: z.coerce.number().int().min(0).max(100000).optional(),
  dateText: optStr(80),
  summary: str(2000),
  photos: z.string().trim().max(8000).optional().default(""),
  albumUrl: optStr(600),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const schoolSchema = z.object({
  name: str(200),
  note: optStr(600),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const sponsorTierSchema = z.object({
  name: str(120),
  price: str(80),
  benefits: z.string().trim().max(3000).optional().default(""),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const teamMemberSchema = z.object({
  name: str(120),
  role: str(120),
  photoUrl: optStr(600),
  bio: optStr(1000),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const testimonialSchema = z.object({
  name: str(120),
  role: str(120),
  quote: str(1200),
  photoUrl: optStr(600),
  eventTag: optStr(80),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const cohortSchema = z.object({
  title: str(160),
  program: str(80),
  mode: z.enum(["ONLINE", "PHYSICAL", "HYBRID"]).default("PHYSICAL"),
  startText: str(120),
  scheduleText: str(160),
  location: optStr(200),
  ageRange: optStr(80),
  priceKes: optStr(60),
  capacity: z.coerce.number().int().min(0).max(100000).optional(),
  summary: str(1200),
  status: z.enum(["OPEN", "UPCOMING", "FULL", "CLOSED"]).default("OPEN"),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const cohortBookingSchema = z.object({
  cohortId: str(40),
  name: str(120),
  email: z.string().trim().email().max(200),
  phone: optStr(40),
  learnerName: optStr(120),
  learnerAge: optStr(40),
  notes: optStr(2000),
});

export const postSchema = z.object({
  title: str(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  category: z.enum(["blog", "news"]).default("blog"),
  excerpt: str(400),
  body: str(60000),
  coverUrl: optStr(600),
  author: optStr(120),
  published: z.coerce.boolean().default(false),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const pastPartnerSchema = z.object({
  name: str(160),
  logoUrl: optStr(600),
  url: optStr(600),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const statSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and underscores only"),
  num: str(40),
  label: str(160),
  group: z.enum(["home", "about", "partner"]),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;

export const userCreateSchema = z.object({
  name: str(120),
  email: z.string().trim().email().max(200).toLowerCase(),
  role: z.enum(ROLES),
  password: z.string().min(10).max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
  password: z.string().min(1).max(200),
});

export function flattenFieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
