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

  return (
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
  );
}
