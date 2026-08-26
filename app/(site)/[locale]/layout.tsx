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
    { label: "Research", href: buildLocalePath("en", "/research") },
    { label: "Publications", href: buildLocalePath("en", "/publications") },
    { label: "Projects", href: buildLocalePath("en", "/projects") },
    { label: "Experience", href: buildLocalePath("en", "/experience") },
    { label: "CV", href: buildLocalePath("en", "/cv") },
    { label: "Blog", href: buildLocalePath("en", "/blog") },
    { label: "Contact", href: buildLocalePath("en", "/contact") }
  ],
  zh: [
    { label: "首页", href: buildLocalePath("zh") },
    { label: "科研概览", href: buildLocalePath("zh", "/research") },
    { label: "发表成果", href: buildLocalePath("zh", "/publications") },
    { label: "项目集锦", href: buildLocalePath("zh", "/projects") },
    { label: "经历", href: buildLocalePath("zh", "/experience") },
    { label: "简历", href: buildLocalePath("zh", "/cv") },
    { label: "博客", href: buildLocalePath("zh", "/blog") },
    { label: "联系", href: buildLocalePath("zh", "/contact") }
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
