"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { LocaleProfile } from "@/lib/content-types";
import type { NavItem } from "@/types/navigation";

type Locale = "en" | "zh";

type SiteShellProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  profile: LocaleProfile;
  locale: Locale;
  email?: string;
  lastUpdated?: string;
};

/**
 * Application shell: a flat paper canvas, a masthead that scrolls away, the
 * page itself, and the closing contact block. No fixed background layer and
 * no sidebar — the page is one continuous column.
 */
export function SiteShell({ children, navItems, profile, locale, email, lastUpdated }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader navItems={navItems} profileName={profile.name} currentLocale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter profile={profile} email={email} lastUpdated={lastUpdated} locale={locale} />
    </div>
  );
}
