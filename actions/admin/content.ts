"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  projectSchema,
  eventSchema,
  visitSchema,
  schoolSchema,
  sponsorTierSchema,
  statSchema,
  teamMemberSchema,
  testimonialSchema,
  pastPartnerSchema,
  postSchema,
  cohortSchema,
} from "@/lib/validators";
import { PAGE_IMAGE_SLOT_KEYS } from "@/lib/page-images";
import {
  parseForm,
  splitList,
  guard,
  audit,
  fail,
  ok,
  type FormState,
} from "./helpers";

/** Public paths that must refresh when content changes. */
const SITE_PATHS = ["/", "/about", "/programs", "/lab", "/impact", "/events", "/build-fest", "/partner", "/contact"];
function revalidateSite() {
  for (const p of SITE_PATHS) revalidatePath(p);
}

// --------------------------------------------------------------------------
// Projects
// --------------------------------------------------------------------------
export async function saveProject(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(projectSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    slug: d.slug,
    title: d.title,
    category: d.category,
    summary: d.summary,
    body: d.body ?? null,
    tech: splitList(d.tech),
    imageUrl: d.imageUrl ?? null,
    featured: d.featured,
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.project.update({ where: { id }, data })
      : await prisma.project.create({ data });
    await audit(null, id ? "update" : "create", "Project", row.id);
  } catch (e) {
    return fail(dbMessage(e, "slug"));
  }
  revalidateSite();
  redirect("/admin/content/projects?saved=1");
}

// --------------------------------------------------------------------------
// Events
// --------------------------------------------------------------------------
export async function saveEvent(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(eventSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;

  let stats: unknown = undefined;
  if (d.statsJson) {
    try {
      stats = JSON.parse(d.statsJson);
    } catch {
      return fail("Stats must be valid JSON, e.g. [{\"num\":\"100+\",\"label\":\"Attendees\"}]", {
        statsJson: "Invalid JSON",
      });
    }
  }

  const data = {
    slug: d.slug,
    title: d.title,
    dateText: d.dateText,
    status: d.status,
    summary: d.summary,
    body: d.body ?? null,
    stats: stats === undefined ? undefined : (stats as object),
    photos: splitList(d.photos),
    videoUrl: d.videoUrl ?? null,
    albumUrl: d.albumUrl ?? null,
    posterUrl: d.posterUrl ?? null,
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.event.update({ where: { id }, data })
      : await prisma.event.create({ data });
    await audit(null, id ? "update" : "create", "Event", row.id);
  } catch (e) {
    return fail(dbMessage(e, "slug"));
  }
  revalidateSite();
  redirect("/admin/content/events?saved=1");
}

// --------------------------------------------------------------------------
// Community visits
// --------------------------------------------------------------------------
export async function saveVisit(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(visitSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    label: d.label,
    place: d.place,
    childrenCount: d.childrenCount ?? null,
    dateText: d.dateText ?? null,
    summary: d.summary,
    photos: splitList(d.photos),
    albumUrl: d.albumUrl ?? null,
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.communityVisit.update({ where: { id }, data })
      : await prisma.communityVisit.create({ data });
    await audit(null, id ? "update" : "create", "CommunityVisit", row.id);
  } catch (e) {
    return fail(dbMessage(e));
  }
  revalidateSite();
  redirect("/admin/content/visits?saved=1");
}

// --------------------------------------------------------------------------
// Schools
// --------------------------------------------------------------------------
export async function saveSchool(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(schoolSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    name: d.name,
    note: d.note ?? null,
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.school.update({ where: { id }, data })
      : await prisma.school.create({ data });
    await audit(null, id ? "update" : "create", "School", row.id);
  } catch (e) {
    return fail(dbMessage(e));
  }
  revalidateSite();
  redirect("/admin/content/schools?saved=1");
}

// --------------------------------------------------------------------------
// Sponsor tiers
// --------------------------------------------------------------------------
export async function saveSponsorTier(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(sponsorTierSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    name: d.name,
    price: d.price,
    benefits: splitList(d.benefits),
    featured: d.featured,
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.sponsorTier.update({ where: { id }, data })
      : await prisma.sponsorTier.create({ data });
    await audit(null, id ? "update" : "create", "SponsorTier", row.id);
  } catch (e) {
    return fail(dbMessage(e));
  }
  revalidateSite();
  redirect("/admin/content/sponsor-tiers?saved=1");
}

// --------------------------------------------------------------------------
// Team members
// --------------------------------------------------------------------------
export async function saveTeamMember(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(teamMemberSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    name: d.name,
    role: d.role,
    photoUrl: d.photoUrl ?? null,
    bio: d.bio ?? null,
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.teamMember.update({ where: { id }, data })
      : await prisma.teamMember.create({ data });
    await audit(null, id ? "update" : "create", "TeamMember", row.id);
  } catch (e) {
    return fail(dbMessage(e));
  }
  revalidateSite();
  redirect("/admin/content/team?saved=1");
}

// --------------------------------------------------------------------------
// Testimonials
// --------------------------------------------------------------------------
export async function saveTestimonial(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(testimonialSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    name: d.name,
    role: d.role,
    quote: d.quote,
    photoUrl: d.photoUrl ?? null,
    eventTag: d.eventTag || "coffee-and-solder",
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.testimonial.update({ where: { id }, data })
      : await prisma.testimonial.create({ data });
    await audit(null, id ? "update" : "create", "Testimonial", row.id);
  } catch (e) {
    return fail(dbMessage(e));
  }
  revalidateSite();
  redirect("/admin/content/testimonials?saved=1");
}

// --------------------------------------------------------------------------
// Partners
// --------------------------------------------------------------------------
export async function savePartner(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(pastPartnerSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    name: d.name,
    logoUrl: d.logoUrl ?? null,
    url: d.url ?? null,
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.partner.update({ where: { id }, data })
      : await prisma.partner.create({ data });
    await audit(null, id ? "update" : "create", "Partner", row.id);
  } catch (e) {
    return fail(dbMessage(e));
  }
  revalidateSite();
  redirect("/admin/content/partners?saved=1");
}

// --------------------------------------------------------------------------
// Blog / tech-news posts
// --------------------------------------------------------------------------
export async function savePost(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(postSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;

  let publishedAt: Date | null | undefined;
  if (d.published) {
    const existing = id
      ? await prisma.post.findUnique({ where: { id }, select: { publishedAt: true } })
      : null;
    publishedAt = existing?.publishedAt ?? new Date();
  } else {
    publishedAt = null;
  }

  const data = {
    title: d.title,
    slug: d.slug,
    category: d.category,
    excerpt: d.excerpt,
    body: d.body,
    coverUrl: d.coverUrl ?? null,
    author: d.author ?? null,
    published: d.published,
    publishedAt,
  };
  try {
    const row = id
      ? await prisma.post.update({ where: { id }, data })
      : await prisma.post.create({ data });
    await audit(null, id ? "update" : "create", "Post", row.id);
  } catch (e) {
    return fail(dbMessage(e, "slug"));
  }
  revalidateSite();
  revalidatePath("/blog");
  redirect("/admin/content/posts?saved=1");
}

// --------------------------------------------------------------------------
// Class cohorts
// --------------------------------------------------------------------------
export async function saveCohort(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(cohortSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    title: d.title,
    program: d.program,
    mode: d.mode,
    startText: d.startText,
    scheduleText: d.scheduleText,
    location: d.location ?? null,
    ageRange: d.ageRange ?? null,
    priceKes: d.priceKes ?? null,
    capacity: d.capacity ?? null,
    summary: d.summary,
    status: d.status,
    published: d.published,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.cohort.update({ where: { id }, data })
      : await prisma.cohort.create({ data });
    await audit(null, id ? "update" : "create", "Cohort", row.id);
  } catch (e) {
    return fail(dbMessage(e));
  }
  revalidateSite();
  redirect("/admin/content/cohorts?saved=1");
}

// --------------------------------------------------------------------------
// Fixed page images
// --------------------------------------------------------------------------
export async function savePageImages(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  try {
    for (const slot of PAGE_IMAGE_SLOT_KEYS) {
      const url = String(formData.get(`url:${slot}`) ?? "").trim() || null;
      const alt = String(formData.get(`alt:${slot}`) ?? "").trim() || null;
      await prisma.pageImage.upsert({
        where: { slot },
        update: { url, alt },
        create: { slot, url, alt },
      });
    }
    await audit(null, "update", "PageImage", "all");
  } catch (e) {
    return fail(dbMessage(e));
  }
  revalidateSite();
  return ok("Page images saved.");
}

// --------------------------------------------------------------------------
// Site stats
// --------------------------------------------------------------------------
export async function saveStat(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard("EDITOR");
  const p = parseForm(statSchema, formData);
  if (!p.ok) return p.state;
  const d = p.data;
  const data = {
    key: d.key,
    num: d.num,
    label: d.label,
    group: d.group,
    order: d.order,
  };
  try {
    const row = id
      ? await prisma.siteStat.update({ where: { id }, data })
      : await prisma.siteStat.create({ data });
    await audit(null, id ? "update" : "create", "SiteStat", row.id);
  } catch (e) {
    return fail(dbMessage(e, "key"));
  }
  revalidateSite();
  redirect("/admin/content/stats?saved=1");
}

// --------------------------------------------------------------------------
// Shared row operations (delete / publish toggle / reorder)
// --------------------------------------------------------------------------
type Model =
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

const RETURN: Record<Model, string> = {
  project: "/admin/content/projects",
  event: "/admin/content/events",
  communityVisit: "/admin/content/visits",
  school: "/admin/content/schools",
  sponsorTier: "/admin/content/sponsor-tiers",
  siteStat: "/admin/content/stats",
  teamMember: "/admin/content/team",
  testimonial: "/admin/content/testimonials",
  partner: "/admin/content/partners",
  post: "/admin/content/posts",
  cohort: "/admin/content/cohorts",
};

interface Delegate {
  delete: (args: { where: { id: string } }) => Promise<unknown>;
  update: (args: {
    where: { id: string };
    data: Record<string, unknown>;
  }) => Promise<{ order?: number }>;
  findUnique: (args: {
    where: { id: string };
  }) => Promise<{ order?: number } | null>;
}
function delegate(model: Model): Delegate {
  return (prisma as unknown as Record<Model, Delegate>)[model];
}

export async function deleteRow(model: Model, id: string): Promise<void> {
  await guard("EDITOR");
  await delegate(model).delete({ where: { id } });
  await audit(null, "delete", model, id);
  revalidateSite();
  revalidatePath(RETURN[model]);
}

export async function togglePublished(
  model: Exclude<Model, "siteStat">,
  id: string,
  next: boolean,
): Promise<void> {
  await guard("EDITOR");
  await delegate(model).update({ where: { id }, data: { published: next } });
  revalidateSite();
  revalidatePath(RETURN[model]);
}

export async function nudgeOrder(
  model: Model,
  id: string,
  delta: number,
): Promise<void> {
  await guard("EDITOR");
  const row = await delegate(model).findUnique({ where: { id } });
  if (!row) return;
  await delegate(model).update({
    where: { id },
    data: { order: Math.max(0, (row.order ?? 0) + delta) },
  });
  revalidateSite();
  revalidatePath(RETURN[model]);
}

function dbMessage(e: unknown, uniqueField?: string): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("Unique constraint") && uniqueField) {
    return `That ${uniqueField} is already taken — choose another.`;
  }
  console.error("[content:error]", e);
  return "Could not save. Please try again.";
}
