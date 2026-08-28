import { notFound } from "next/navigation";

import { ArticleShell } from "@/components/article-shell";
import { TableOfContents } from "@/components/toc";
import { Tag } from "@/components/tag";
import { extractToc, renderMdx } from "@/lib/mdx";
import { LOCALES, normalizeLocale } from "@/lib/locale";
import { getAllPublicationSlugs, getPublicationDetail } from "@/lib/publications";

type PageParams = { locale: string; slug: string };

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPublicationSlugs();
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of LOCALES) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

const TYPE_BADGE: Record<string, { en: string; zh: string }> = {
  C: { en: "Conference", zh: "会议" },
  J: { en: "Journal", zh: "期刊" },
  P: { en: "Patent", zh: "专利" },
  S: { en: "Preprint", zh: "预印本" }
};

export default async function PublicationDetailPage({ params }: PageProps) {
  const resolved = await params;
  const locale = normalizeLocale(resolved.locale);
  if (!locale) {
    notFound();
  }

  const detail = await getPublicationDetail(locale, resolved.slug);
  if (!detail) {
    notFound();
  }

  const { entry, content: mdxSource } = detail;
  const content = mdxSource ? await renderMdx(mdxSource) : null;
  const toc = extractToc(mdxSource ?? "");

  const backLabel = locale === "zh" ? "返回成果" : "Back to publications";
  const tocTitle = locale === "zh" ? "本文目录" : "On this page";
  const typeBadge = TYPE_BADGE[entry.type]?.[locale] ?? entry.type;

  return (
    <ArticleShell
      locale={locale}
      backLabel={backLabel}
      backHref={`/${locale}/publications`}
      title={entry.title}
      meta={
        <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <p className="text-base text-slate-700 dark:text-slate-200">
            {entry.authors} · <span className="tabular-nums">{entry.year}</span>
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <Tag label={typeBadge} />
            <span>{entry.venue}</span>
          </p>
          {entry.links?.length ? (
            <p className="flex flex-wrap gap-x-4 gap-y-1 font-medium">
              {entry.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand hover:text-brand-foreground"
                >
                  {link.label} ↗
                </a>
              ))}
            </p>
          ) : null}
        </div>
      }
      toc={<TableOfContents entries={toc} title={tocTitle} />}
    >
      {content ?? (
        <p className="text-slate-600 dark:text-slate-300">
          {entry.notes ?? (locale === "zh" ? "详细介绍即将上线。" : "A detailed write-up is coming soon.")}
        </p>
      )}
    </ArticleShell>
  );
}
