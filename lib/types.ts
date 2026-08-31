// Shared content types. Public pages read these shapes from lib/content.ts,
// which is backed by fixtures in phase 1 and by Prisma from phase 2 on.

export type ProjectCategory = "ROBOT" | "PCB" | "IOT";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  body?: string | null;
  tech: string[];
  imageUrl?: string | null;
  featured: boolean;
  order: number;
}

export interface EventStat {
  num: string;
  label: string;
}

export interface SiteEvent {
  slug: string;
  title: string;
  dateText: string;
  status: "PAST" | "UPCOMING";
  summary: string;
  stats: EventStat[];
  photos: string[];
  videoUrl?: string | null;
  albumUrl?: string | null;
  posterUrl?: string | null;
  body?: string | null;
  order: number;
}

export interface CommunityVisit {
  label: string;
  place: string;
  childrenCount?: number | null;
  dateText?: string | null;
  summary: string;
  photos: string[];
  albumUrl?: string | null;
  order: number;
}

export interface School {
  name: string;
  note?: string | null;
  order: number;
}

export interface SponsorTier {
  name: string;
  price: string;
  featured: boolean;
  benefits: string[];
  order: number;
}

export interface SiteStat {
  key: string;
  num: string;
  label: string;
  group: string;
  order: number;
}

export interface TeamMember {
  name: string;
  role: string;
  photoUrl?: string | null;
  bio?: string | null;
  order: number;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  photoUrl?: string | null;
  eventTag: string;
  order: number;
}

export interface Partner {
  name: string;
  logoUrl?: string | null;
  url?: string | null;
  order: number;
}

export type PageImageMap = Record<
  string,
  { url: string | null; alt: string | null }
>;

export interface Post {
  slug: string;
  title: string;
  category: string; // "blog" | "news"
  excerpt: string;
  body: string;
  coverUrl?: string | null;
  author?: string | null;
  publishedAt?: string | null;
}

export interface Cohort {
  id: string;
  title: string;
  program: string;
  mode: "ONLINE" | "PHYSICAL" | "HYBRID";
  startText: string;
  scheduleText: string;
  location?: string | null;
  ageRange?: string | null;
  priceKes?: string | null;
  capacity?: number | null;
  summary: string;
  status: "OPEN" | "UPCOMING" | "FULL" | "CLOSED";
  order: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  regNo: string;
  announceText: string;
  announceLink: string;
  announceLinkLabel: string;
  buildFestDate: string;
  buildFestCapacity: number;
  buildFestTime: string;
  buildFestVenue: string;
  buildFestTicketKes: string;
  logoUrl: string;
  photosAlbumUrl: string;
  social: {
    tiktok: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    x: string;
    facebook: string;
  };
}
