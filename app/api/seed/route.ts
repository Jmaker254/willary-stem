import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import {
  SETTINGS,
  STATS,
  PROJECTS,
  EVENTS,
  VISITS,
  SCHOOLS,
  SPONSOR_TIERS,
  TEAM,
  TESTIMONIALS,
  PARTNERS,
  POSTS,
  COHORTS,
} from "@/lib/fixtures";

export const dynamic = "force-dynamic";

/**
 * One-time production seeding without shell access.
 *   POST /api/seed?secret=<SEED_SECRET>
 * Idempotent for keyed rows; keyless rows (visits/schools/tiers) only seed when
 * their table is empty. Disabled unless SEED_SECRET is set.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SEED_SECRET;
  if (!secret) return new NextResponse("Seeding disabled", { status: 404 });
  if (req.nextUrl.searchParams.get("secret") !== secret) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@willarystem.co.ke").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123456";
  const name = process.env.SEED_ADMIN_NAME ?? "Willary Admin";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role: "ADMIN", passwordHash: await hashPassword(password) },
  });

  const settingRows: [string, string | number][] = [
    ["siteName", SETTINGS.siteName],
    ["tagline", SETTINGS.tagline],
    ["phone", SETTINGS.phone],
    ["email", SETTINGS.email],
    ["location", SETTINGS.location],
    ["regNo", SETTINGS.regNo],
    ["announceText", SETTINGS.announceText],
    ["announceLink", SETTINGS.announceLink],
    ["announceLinkLabel", SETTINGS.announceLinkLabel],
    ["buildFestDate", SETTINGS.buildFestDate],
    ["buildFestCapacity", SETTINGS.buildFestCapacity],
    ["buildFestTime", SETTINGS.buildFestTime],
    ["buildFestVenue", SETTINGS.buildFestVenue],
    ["buildFestTicketKes", SETTINGS.buildFestTicketKes],
    ["logoUrl", SETTINGS.logoUrl],
    ["photosAlbumUrl", SETTINGS.photosAlbumUrl],
    ["social.tiktok", SETTINGS.social.tiktok],
    ["social.instagram", SETTINGS.social.instagram],
    ["social.linkedin", SETTINGS.social.linkedin],
    ["social.youtube", SETTINGS.social.youtube],
    ["social.x", SETTINGS.social.x],
    ["social.facebook", SETTINGS.social.facebook],
  ];
  for (const [key, value] of settingRows) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value: value as never },
    });
  }

  for (const s of STATS) {
    await prisma.siteStat.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  for (const p of PROJECTS) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        summary: p.summary,
        tech: p.tech,
        featured: p.featured,
        order: p.order,
      },
    });
  }
  for (const e of EVENTS) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        title: e.title,
        dateText: e.dateText,
        status: e.status,
        summary: e.summary,
        stats: e.stats as unknown as Prisma.InputJsonValue,
        order: e.order,
      },
    });
  }
  if ((await prisma.communityVisit.count()) === 0)
    await prisma.communityVisit.createMany({ data: VISITS });
  if ((await prisma.school.count()) === 0)
    await prisma.school.createMany({ data: SCHOOLS });
  if ((await prisma.sponsorTier.count()) === 0)
    await prisma.sponsorTier.createMany({ data: SPONSOR_TIERS });
  if ((await prisma.teamMember.count()) === 0)
    await prisma.teamMember.createMany({ data: TEAM });
  if ((await prisma.testimonial.count()) === 0)
    await prisma.testimonial.createMany({ data: TESTIMONIALS });
  if ((await prisma.partner.count()) === 0)
    await prisma.partner.createMany({ data: PARTNERS });
  if ((await prisma.cohort.count()) === 0)
    for (const c of COHORTS)
      await prisma.cohort.create({
        data: {
          title: c.title,
          program: c.program,
          mode: c.mode,
          startText: c.startText,
          scheduleText: c.scheduleText,
          location: c.location ?? null,
          ageRange: c.ageRange ?? null,
          priceKes: c.priceKes ?? null,
          capacity: c.capacity ?? null,
          summary: c.summary,
          status: c.status,
          order: c.order,
        },
      });
  if ((await prisma.post.count()) === 0)
    for (const p of POSTS)
      await prisma.post.create({
        data: {
          slug: p.slug,
          title: p.title,
          category: p.category,
          excerpt: p.excerpt,
          body: p.body,
          coverUrl: p.coverUrl ?? null,
          author: p.author ?? null,
          published: true,
          publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(),
        },
      });

  return NextResponse.json({ ok: true, admin: email });
}
