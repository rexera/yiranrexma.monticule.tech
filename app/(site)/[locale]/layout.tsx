import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { getProfileContent, getUpdatesContent } from "@/lib/content";
import { buildLocalePath, LOCALES, normalizeLocale, type Locale } from "@/lib/locale";
import type { NavItem } from "@/types/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const NAV_ITEMS: Record<Locale, NavItem[]> = {
  en: [
    { label: "Home", href: buildLocalePath("en") },
    { label: "Blog", href: buildLocalePath("en", "/blog") },
    { label: "Publication/Project", href: buildLocalePath("en", "/publications") },
    { label: "Story", href: buildLocalePath("en", "/experience") },
    { label: "CV", href: buildLocalePath("en", "/cv") }
  ],
  zh: [
    { label: "首页", href: buildLocalePath("zh") },
    { label: "博客", href: buildLocalePath("zh", "/blog") },
    { label: "成果", href: buildLocalePath("zh", "/publications") },
    { label: "故事", href: buildLocalePath("zh", "/experience") },
    { label: "简历", href: buildLocalePath("zh", "/cv") }
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
  const lastUpdated = getUpdatesContent()[locale]?.updates?.[0]?.date;

  return (
    <SiteShell navItems={navItems} profile={profile} locale={locale} lastUpdated={lastUpdated}>
      {children}
    </SiteShell>
  );
}
