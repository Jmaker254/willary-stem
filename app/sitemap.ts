import type { MetadataRoute } from "next";
import {
  getPostSlugs,
  getProductSlugs,
  getProductCategorySlugs,
} from "@/lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.willaryrobotics.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/build-fest", priority: 0.9, changeFrequency: "weekly" },
    { path: "/build-fest/register", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/programs", priority: 0.7, changeFrequency: "monthly" },
    { path: "/lab", priority: 0.7, changeFrequency: "monthly" },
    { path: "/impact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/events", priority: 0.7, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/shop", priority: 0.8, changeFrequency: "weekly" },
    { path: "/partner", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    const slugs = await getPostSlugs();
    for (const slug of slugs) {
      entries.push({
        url: `${SITE_URL}/blog/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    /* posts optional */
  }

  try {
    const [catSlugs, productSlugs] = await Promise.all([
      getProductCategorySlugs(),
      getProductSlugs(),
    ]);
    for (const slug of catSlugs) {
      entries.push({
        url: `${SITE_URL}/shop/c/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    for (const slug of productSlugs) {
      entries.push({
        url: `${SITE_URL}/shop/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    /* shop optional */
  }

  return entries;
}
