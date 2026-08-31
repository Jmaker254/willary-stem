import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
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
} from "../lib/fixtures";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@willarystem.co.ke").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123456";
  const name = process.env.SEED_ADMIN_NAME ?? "Willary Admin";
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: { email, name, role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✓ admin user: ${email}`);

  // --- Settings ---
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
      update: { value: value as never },
      create: { key, value: value as never },
    });
  }
  console.log(`✓ ${settingRows.length} settings`);

  // --- Stats ---
  for (const s of STATS) {
    await prisma.siteStat.upsert({
      where: { key: s.key },
      update: { num: s.num, label: s.label, group: s.group, order: s.order },
      create: s,
    });
  }
  console.log(`✓ ${STATS.length} stats`);

  // --- Projects ---
  for (const p of PROJECTS) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        category: p.category,
        summary: p.summary,
        tech: p.tech,
        featured: p.featured,
        order: p.order,
      },
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
  console.log(`✓ ${PROJECTS.length} projects`);

  // --- Events ---
  for (const e of EVENTS) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {
        title: e.title,
        dateText: e.dateText,
        status: e.status,
        summary: e.summary,
        stats: e.stats as unknown as Prisma.InputJsonValue,
        order: e.order,
      },
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
  console.log(`✓ ${EVENTS.length} events`);

  // --- Community visits (no natural key; only seed if empty) ---
  if ((await prisma.communityVisit.count()) === 0) {
    await prisma.communityVisit.createMany({ data: VISITS });
    console.log(`✓ ${VISITS.length} community visits`);
  } else {
    console.log("• community visits already present — skipped");
  }

  // --- Schools ---
  if ((await prisma.school.count()) === 0) {
    await prisma.school.createMany({ data: SCHOOLS });
    console.log(`✓ ${SCHOOLS.length} schools`);
  } else {
    console.log("• schools already present — skipped");
  }

  // --- Sponsor tiers ---
  if ((await prisma.sponsorTier.count()) === 0) {
    await prisma.sponsorTier.createMany({ data: SPONSOR_TIERS });
    console.log(`✓ ${SPONSOR_TIERS.length} sponsor tiers`);
  } else {
    console.log("• sponsor tiers already present — skipped");
  }

  // --- Team ---
  if ((await prisma.teamMember.count()) === 0) {
    await prisma.teamMember.createMany({ data: TEAM });
    console.log(`✓ ${TEAM.length} team members`);
  } else {
    console.log("• team already present — skipped");
  }

  // --- Testimonials ---
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: TESTIMONIALS });
    console.log(`✓ ${TESTIMONIALS.length} testimonials`);
  } else {
    console.log("• testimonials already present — skipped");
  }

  // --- Partners ---
  if ((await prisma.partner.count()) === 0) {
    await prisma.partner.createMany({ data: PARTNERS });
    console.log(`✓ ${PARTNERS.length} partners`);
  } else {
    console.log("• partners already present — skipped");
  }

  // --- Class cohorts ---
  if ((await prisma.cohort.count()) === 0) {
    for (const c of COHORTS) {
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
    }
    console.log(`✓ ${COHORTS.length} class cohorts`);
  } else {
    console.log("• cohorts already present — skipped");
  }

  // --- Blog / news posts ---
  if ((await prisma.post.count()) === 0) {
    for (const p of POSTS) {
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
    }
    console.log(`✓ ${POSTS.length} posts`);
  } else {
    console.log("• posts already present — skipped");
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
