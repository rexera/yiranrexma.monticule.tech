import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleShell } from "@/components/article-shell";
import { TableOfContents } from "@/components/toc";
import { Tag } from "@/components/tag";
import { getAllBlogSlugs, getBlogPostWithFallback } from "@/lib/blog";
import { extractToc, renderMdx } from "@/lib/mdx";
import { LOCALES, normalizeLocale } from "@/lib/locale";

type PageParams = { locale: string; slug: string };

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yiranrexma.monticule.tech";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of LOCALES) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = normalizeLocale(resolved.locale) ?? "en";
  const post = await getBlogPostWithFallback(locale, resolved.slug);
  if (!post) {
    return {};
  }
  return {
    title: post.title,
    description: post.summary || `${post.title} — a ${post.type} note by Yiran Rex Ma.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${post.slug}`,
      languages: {
        en: `${SITE_URL}/en/blog/${post.slug}`,
        zh: `${SITE_URL}/zh/blog/${post.slug}`
      }
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary || undefined,
      publishedTime: post.date,
      tags: post.tags
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolved = await params;
  const locale = normalizeLocale(resolved.locale);
  if (!locale) {
    notFound();
  }

  const post = await getBlogPostWithFallback(locale, resolved.slug);

  if (!post) {
    notFound();
  }

  const content = await renderMdx(post.content);
  const toc = extractToc(post.content);

  const backLabel = locale === "zh" ? "返回博客" : "Back to blog";
  const tocTitle = locale === "zh" ? "本文目录" : "On this page";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: "Yiran Rex Ma", url: SITE_URL },
    url: `${SITE_URL}/${locale}/blog/${post.slug}`,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    keywords: post.tags.join(", ")
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleShell
        locale={locale}
        backLabel={backLabel}
        backHref={`/${locale}/blog`}
        title={post.title}
        meta={
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <time className="tabular-nums">{post.date}</time>
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        }
        toc={<TableOfContents entries={toc} title={tocTitle} />}
      >
        {content}
      </ArticleShell>
    </>
  );
}
