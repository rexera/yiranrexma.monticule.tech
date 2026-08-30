import type { MetadataRoute } from "next";

import { getAllBlogSlugs } from "@/lib/blog";
import { getAllPublicationSlugs } from "@/lib/publications";
import { LOCALES } from "@/lib/locale";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yiranrexma.monticule.tech";

/**
 * Full sitemap across both locales: the static tabs plus every blog post
 * and publication detail page. Static-export compatible (baked at build).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, publicationSlugs] = await Promise.all([
    getAllBlogSlugs(),
    getAllPublicationSlugs()
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const base = `${SITE_URL}/${locale}`;
    entries.push(
      { url: base, changeFrequency: "weekly", priority: 1 },
      { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${base}/publications`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/experience`, changeFrequency: "monthly", priority: 0.6 }
    );
    for (const slug of blogSlugs) {
      entries.push({ url: `${base}/blog/${slug}`, changeFrequency: "monthly", priority: 0.7 });
    }
    for (const slug of publicationSlugs) {
      entries.push({ url: `${base}/publications/${slug}`, changeFrequency: "yearly", priority: 0.6 });
    }
  }

  return entries;
}
