import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { getProfileContent, getUpdatesContent } from "@/lib/content";
import { getRecentCommits } from "@/lib/commits";
import { buildLocalePath, LOCALES, normalizeLocale, type Locale } from "@/lib/locale";
import type { NavItem } from "@/types/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const LOCALE_DESCRIPTIONS: Record<Locale, string> = {
  en: "Yiran Rex Ma — Ph.D. student in Theoretical and Applied Linguistics at Peking University. Foundation language models, continual learning, personal models, and AI for the humanities.",
  zh: "马义然（Yiran Rex Ma）——北京大学理论语言学与应用语言学博士研究生。基础语言模型、持续学习、个人模型与计算人文。"
};

export async function generateMetadata({ params }: { params: { locale: string } | Promise<{ locale: string }> }): Promise<Metadata> {
  const resolved = await params;
  const locale = normalizeLocale(resolved.locale) ?? "en";
  return {
    description: LOCALE_DESCRIPTIONS[locale],
    openGraph: {
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? "en_US" : "zh_CN"
    }
  };
}

const NAV_ITEMS: Record<Locale, NavItem[]> = {
  en: [
    { label: "Home", href: buildLocalePath("en") },
    { label: "Blog", href: buildLocalePath("en", "/blog") },
    { label: "Publication/Project", href: buildLocalePath("en", "/publications") },
    { label: "Story", href: buildLocalePath("en", "/experience") },
    { label: "CV", href: "/cv.html", external: true }
  ],
  zh: [
    { label: "首页", href: buildLocalePath("zh") },
    { label: "博客", href: buildLocalePath("zh", "/blog") },
    { label: "成果", href: buildLocalePath("zh", "/publications") },
    { label: "故事", href: buildLocalePath("zh", "/experience") },
    { label: "简历", href: "/cv.html", external: true }
  ]
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const profile = getProfileContent()[locale];
  const navItems = NAV_ITEMS[locale];
  // "Last updated" mirrors the newest commit on this repository — the same
  // source as the Home page commits strip. Falls back to the newest curated
  // update if the GitHub API is unreachable at build time.
  const lastUpdated =
    (await getRecentCommits())?.[0]?.date ??
    getUpdatesContent()[locale]?.updates?.[0]?.date;

  return (
    // lang on the wrapper (display:contents keeps layout untouched) gives
    // the zh pages a correct language signal even though the root <html>
    // is shared with the locale-less redirect stubs.
    <div lang={locale} className="contents">
      <SiteShell navItems={navItems} profile={profile} locale={locale} lastUpdated={lastUpdated}>
        {children}
      </SiteShell>
    </div>
  );
}
