import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { notFound } from "next/navigation";

import { ArticleReveal } from "@/components/article-reveal";
import { PageHeader } from "@/components/page-header";
import { ReadingProgress } from "@/components/reading-progress";
import { ScrollToHash } from "@/components/scroll-to-hash";
import { getStoryPageCopy } from "@/lib/content";
import { normalizeLocale, type Locale } from "@/lib/locale";
import { renderMdx } from "@/lib/mdx";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yiranrexma.monticule.tech";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale) ?? "en";
  return {
    title: locale === "zh" ? "故事" : "Story",
    alternates: {
      canonical: `${SITE_URL}/${locale}/story`,
      languages: {
        en: `${SITE_URL}/en/story`,
        zh: `${SITE_URL}/zh/story`,
        "x-default": `${SITE_URL}/en/story`
      }
    }
  };
}

const ABOUT_DIR = path.join(process.cwd(), "content", "about");

async function getAboutStory(locale: Locale): Promise<string | null> {
  for (const candidate of [locale, "en"] as const) {
    try {
      const raw = await readFile(path.join(ABOUT_DIR, `${candidate}.mdx`), "utf8");
      return matter(raw).content;
    } catch {
      // try the next locale
    }
  }
  return null;
}

export default async function StoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const copy = getStoryPageCopy()[locale];
  const story = await getAboutStory(locale);

  // Same MDX pipeline and typography as the blog — one reading style site-wide.
  const storyContent = story ? await renderMdx(story, locale) : null;

  return (
    <div className="container-page py-10 sm:py-14">
      <ReadingProgress />
      <ArticleReveal />
      <ScrollToHash />
      <div className="mx-auto w-full max-w-[46rem]">
        <PageHeader
          eyebrow={locale === "zh" ? "故事" : "Story"}
          title={copy.story.title}
        />
        <div className="mt-8 border-t border-line/15" />
        {storyContent ? (
          <div className="prose mdx-article mt-8 max-w-none">{storyContent}</div>
        ) : null}
      </div>
    </div>
  );
}
