import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogClient } from "@/app/(site)/blog/blog-client";
import { getBlogPostMetas } from "@/lib/blog";
import { getBlogPageCopy } from "@/lib/content";
import { getFallbackLocale, normalizeLocale, type Locale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yiranrexma.monticule.tech";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale) ?? "en";
  return {
    title: locale === "zh" ? "博客" : "Blog",
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: {
        en: `${SITE_URL}/en/blog`,
        zh: `${SITE_URL}/zh/blog`,
        "x-default": `${SITE_URL}/en/blog`
      }
    }
  };
}

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
  const copy = getBlogPageCopy()[locale as Locale];

  return <BlogClient copy={copy} posts={posts} locale={locale} />;
}
