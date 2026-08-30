import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { getExperiencePageCopy } from "@/lib/content";
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
      canonical: `${SITE_URL}/${locale}/experience`,
      languages: {
        en: `${SITE_URL}/en/experience`,
        zh: `${SITE_URL}/zh/experience`,
        "x-default": `${SITE_URL}/en/experience`
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

export default async function ExperiencePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const copy = getExperiencePageCopy()[locale];
  const story = await getAboutStory(locale);

  // Same MDX pipeline and typography as the blog — one reading style site-wide.
  const storyContent = story ? await renderMdx(story) : null;

  return (
    <div className="mx-auto w-full max-w-[46rem] space-y-16">
      {storyContent ? (
        <Section title={copy.story.title}>
          <div className="prose mdx-article max-w-none">{storyContent}</div>
        </Section>
      ) : null}
    </div>
  );
}
