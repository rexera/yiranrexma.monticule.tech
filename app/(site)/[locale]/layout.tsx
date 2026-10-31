import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { getHomePageCopy, getProfileContent } from "@/lib/content";
import { buildLocalePath, LOCALES, normalizeLocale, type Locale } from "@/lib/locale";
import type { NavItem } from "@/types/navigation";

export const dynamicParams = false;

/** Footer provenance is the publish date, not the newest content entry: every
 *  build stamps the day it shipped. Pages are prerendered, so this is the
 *  deploy date; the timezone is pinned so a UTC build still shows the
 *  Beijing calendar day. */
const LAST_UPDATED = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date());

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const LOCALE_DESCRIPTIONS: Record<Locale, string> = {
  en: "Yiran Rex Ma — independent researcher, foundation LLMs, continual learning, personal models.",
  zh: "马义然——独立研究者、基础LLM、持续学习、个性模型"
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
    { label: "Work", href: buildLocalePath("en", "/publications") },
    { label: "Story", href: buildLocalePath("en", "/story") }
  ],
  zh: [
    { label: "首页", href: buildLocalePath("zh") },
    { label: "博客", href: buildLocalePath("zh", "/blog") },
    { label: "成果", href: buildLocalePath("zh", "/publications") },
    { label: "故事", href: buildLocalePath("zh", "/story") }
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
  // One quiet date is enough provenance: the newest curated update.
  const lastUpdated = LAST_UPDATED;
  const email = getHomePageCopy()[locale].email;

  return (
    // lang on the wrapper (display:contents keeps layout untouched) gives
    // the zh pages a correct language signal even though the root <html>
    // is shared with the locale-less redirect stubs.
    <div lang={locale} className="contents">
      <SiteShell
        navItems={navItems}
        profile={profile}
        locale={locale}
        email={email}
        lastUpdated={lastUpdated}
      >
        {children}
      </SiteShell>
    </div>
  );
}
