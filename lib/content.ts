import { prisma } from "@/lib/db";
import type {
  Project,
  SiteEvent,
  CommunityVisit,
  School,
  SponsorTier,
  SiteStat,
  SiteSettings,
  TeamMember,
  Testimonial,
  Partner,
  PageImageMap,
  Post,
  Cohort,
} from "./types";
import * as fx from "./fixtures";

/**
 * Content accessors. Each reads from the database; when a table is still empty
 * (e.g. before `npm run db:seed`) it falls back to the fixtures in ./fixtures,
 * so the public site always renders.
 */

export const SETTING_KEYS = [
  "siteName",
  "tagline",
  "phone",
  "email",
  "location",
  "regNo",
  "announceText",
  "announceLink",
  "announceLinkLabel",
  "buildFestDate",
  "buildFestCapacity",
  "buildFestTime",
  "buildFestVenue",
  "buildFestTicketKes",
  "logoUrl",
  "photosAlbumUrl",
  "social.tiktok",
  "social.instagram",
  "social.linkedin",
  "social.youtube",
  "social.x",
  "social.facebook",
] as const;

export async function getSettings(): Promise<SiteSettings> {
  const base = fx.SETTINGS;
  try {
    const rows = await prisma.setting.findMany();
    if (rows.length === 0) return base;
    const map = new Map(rows.map((r) => [r.key, r.value as unknown]));
    const get = (k: string, d: string) => (map.has(k) ? String(map.get(k)) : d);
    return {
      siteName: get("siteName", base.siteName),
      tagline: get("tagline", base.tagline),
      phone: get("phone", base.phone),
      email: get("email", base.email),
      location: get("location", base.location),
      regNo: get("regNo", base.regNo),
      announceText: get("announceText", base.announceText),
      announceLink: get("announceLink", base.announceLink),
      announceLinkLabel: get("announceLinkLabel", base.announceLinkLabel),
      buildFestDate: get("buildFestDate", base.buildFestDate),
      buildFestCapacity: Number(
        map.get("buildFestCapacity") ?? base.buildFestCapacity,
      ),
      buildFestTime: get("buildFestTime", base.buildFestTime),
      buildFestVenue: get("buildFestVenue", base.buildFestVenue),
      buildFestTicketKes: get("buildFestTicketKes", base.buildFestTicketKes),
      logoUrl: get("logoUrl", base.logoUrl),
      photosAlbumUrl: get("photosAlbumUrl", base.photosAlbumUrl),
      social: {
        tiktok: get("social.tiktok", base.social.tiktok),
        instagram: get("social.instagram", base.social.instagram),
        linkedin: get("social.linkedin", base.social.linkedin),
        youtube: get("social.youtube", base.social.youtube),
        x: get("social.x", base.social.x),
        facebook: get("social.facebook", base.social.facebook),
      },
    };
  } catch {
    return base;
  }
}

export async function getSiteStats(group: string): Promise<SiteStat[]> {
  try {
    const rows = await prisma.siteStat.findMany({
      where: { group },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        key: r.key,
        num: r.num,
        label: r.label,
        group: r.group,
        order: r.order,
      }));
  } catch {}
  return fx.STATS.filter((s) => s.group === group).sort((a, b) => a.order - b.order);
}

export async function getProjects(): Promise<Project[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        category: r.category,
        summary: r.summary,
        body: r.body,
        tech: r.tech,
        imageUrl: r.imageUrl,
        featured: r.featured,
        order: r.order,
      }));
  } catch {}
  return [...fx.PROJECTS].sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProject(slug: string): Promise<Project | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export async function getEvents(): Promise<SiteEvent[]> {
  try {
    const rows = await prisma.event.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        dateText: r.dateText,
        status: r.status,
        summary: r.summary,
        stats: Array.isArray(r.stats) ? (r.stats as { num: string; label: string }[]) : [],
        photos: r.photos ?? [],
        videoUrl: r.videoUrl,
        albumUrl: r.albumUrl,
        posterUrl: r.posterUrl,
        body: r.body,
        order: r.order,
      }));
  } catch {}
  return [...fx.EVENTS].sort((a, b) => a.order - b.order);
}

export async function getCommunityVisits(): Promise<CommunityVisit[]> {
  try {
    const rows = await prisma.communityVisit.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        label: r.label,
        place: r.place,
        childrenCount: r.childrenCount,
        dateText: r.dateText,
        summary: r.summary,
        photos: r.photos ?? [],
        albumUrl: r.albumUrl,
        order: r.order,
      }));
  } catch {}
  return [...fx.VISITS].sort((a, b) => a.order - b.order);
}

export async function getSchools(): Promise<School[]> {
  try {
    const rows = await prisma.school.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({ name: r.name, note: r.note, order: r.order }));
  } catch {}
  return [...fx.SCHOOLS].sort((a, b) => a.order - b.order);
}

export async function getSponsorTiers(): Promise<SponsorTier[]> {
  try {
    const rows = await prisma.sponsorTier.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        name: r.name,
        price: r.price,
        featured: r.featured,
        benefits: r.benefits,
        order: r.order,
      }));
  } catch {}
  return [...fx.SPONSOR_TIERS].sort((a, b) => a.order - b.order);
}

export async function getTeam(): Promise<TeamMember[]> {
  try {
    const rows = await prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        name: r.name,
        role: r.role,
        photoUrl: r.photoUrl,
        bio: r.bio,
        order: r.order,
      }));
  } catch {}
  return [...fx.TEAM].sort((a, b) => a.order - b.order);
}

export async function getTestimonials(tag?: string): Promise<Testimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { published: true, ...(tag ? { eventTag: tag } : {}) },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        name: r.name,
        role: r.role,
        quote: r.quote,
        photoUrl: r.photoUrl,
        eventTag: r.eventTag,
        order: r.order,
      }));
  } catch {}
  return [...fx.TESTIMONIALS]
    .filter((t) => !tag || t.eventTag === tag)
    .sort((a, b) => a.order - b.order);
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const rows = await prisma.partner.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        name: r.name,
        logoUrl: r.logoUrl,
        url: r.url,
        order: r.order,
      }));
  } catch {}
  return [...fx.PARTNERS].sort((a, b) => a.order - b.order);
}

export async function getPageImages(): Promise<PageImageMap> {
  const map: PageImageMap = {};
  try {
    const rows = await prisma.pageImage.findMany();
    for (const r of rows) map[r.slot] = { url: r.url, alt: r.alt };
  } catch {}
  return map;
}

function mapPost(r: {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  coverUrl: string | null;
  author: string | null;
  publishedAt: Date | null;
}): Post {
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    excerpt: r.excerpt,
    body: r.body,
    coverUrl: r.coverUrl,
    author: r.author,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
  };
}

export async function getPosts(category?: string): Promise<Post[]> {
  try {
    const rows = await prisma.post.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    if (rows.length > 0) return rows.map(mapPost);
  } catch {}
  return [...fx.POSTS]
    .filter((p) => !category || p.category === category)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const row = await prisma.post.findFirst({ where: { slug, published: true } });
    if (row) return mapPost(row);
  } catch {}
  return fx.POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });
    if (rows.length > 0) return rows.map((r) => r.slug);
  } catch {}
  return fx.POSTS.map((p) => p.slug);
}

export async function getCohorts(): Promise<Cohort[]> {
  try {
    const rows = await prisma.cohort.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length > 0)
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        program: r.program,
        mode: r.mode,
        startText: r.startText,
        scheduleText: r.scheduleText,
        location: r.location,
        ageRange: r.ageRange,
        priceKes: r.priceKes,
        capacity: r.capacity,
        summary: r.summary,
        status: r.status,
        order: r.order,
      }));
  } catch {}
  return [...fx.COHORTS].sort((a, b) => a.order - b.order);
}

export async function getCohort(id: string): Promise<Cohort | null> {
  return (await getCohorts()).find((c) => c.id === id) ?? null;
}
