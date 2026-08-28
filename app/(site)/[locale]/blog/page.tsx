import { notFound } from "next/navigation";

import { BlogClient } from "@/app/(site)/blog/blog-client";
import { getBlogPostMetas } from "@/lib/blog";
import { getBlogPageCopy } from "@/lib/content";
import { getFallbackLocale, normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  let posts = await getBlogPostMetas(locale);
  if (posts.length === 0) {
    // No posts authored in this locale yet — fall back to the primary locale.
    posts = await getBlogPostMetas(getFallbackLocale(locale));
  }
  const copy = getBlogPageCopy()[locale];

  return <BlogClient copy={copy} posts={posts} locale={locale} />;
}
