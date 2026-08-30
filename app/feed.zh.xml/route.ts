import { getBlogPostMetas } from "@/lib/blog";
import { getFallbackLocale } from "@/lib/locale";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yiranrexma.monticule.tech";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Chinese blog RSS; falls back to the English posts when a zh version
 *  doesn't exist, mirroring the site's per-slug fallback. */
export async function GET() {
  let posts = await getBlogPostMetas("zh");
  if (posts.length === 0) {
    posts = await getBlogPostMetas(getFallbackLocale("zh"));
  }
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/zh/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/zh/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ""}
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>马义然 — 博客</title>
    <link>${SITE_URL}/zh/blog</link>
    <atom:link href="${SITE_URL}/feed.zh.xml" rel="self" type="application/rss+xml"/>
    <description>基础语言模型、持续学习与个人模型的研究笔记。</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
