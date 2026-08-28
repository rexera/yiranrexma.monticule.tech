"use client";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { SideProfileCard } from "@/components/side-profile-card";
import { SiteFooter } from "@/components/site-footer";
import type { LocaleProfile } from "@/lib/content-types";
import type { NavItem } from "@/types/navigation";

type Locale = "en" | "zh";

type SiteShellProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  profile: LocaleProfile;
  locale: Locale;
  lastUpdated?: string;
};

const CONTACT_EMAIL_B64 = process.env.NEXT_PUBLIC_CONTACT_EMAIL_B64 ?? "";

function decodeContactEmail() {
  try {
    return CONTACT_EMAIL_B64 ? atob(CONTACT_EMAIL_B64.trim()) : "";
  } catch {
    return "";
  }
}

function stripLocalePrefix(pathname: string) {
  const match = pathname.match(/^\/(en|zh)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] || "/";
}

/**
 * Application shell. The background is a single fixed layer pinned to the
 * viewport, so the canvas reads as continuous at any scroll position.
 *
 * The content column is fluid end to end: one 1500px cap (no breakpoint
 * jumps), a clamp-width sidebar column on Home, and — on tall viewports —
 * a grid that stretches to fill the screen so the cards grow with the
 * window instead of leaving a dead band below the fold.
 */
export function SiteShell({ children, navItems, profile, locale, lastUpdated }: SiteShellProps) {
  const pathname = usePathname();
  const normalizedPath = stripLocalePrefix((pathname ?? "/").replace(/\/$/, "") || "/");
  const showSidebar = normalizedPath === "/";
  const contactEmail = decodeContactEmail();

  return (
    <div className="relative isolate min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(129,152,106,0.12),transparent_38%),radial-gradient(circle_at_88%_12%,rgba(193,201,137,0.14),transparent_32%)] dark:bg-[radial-gradient(circle_at_15%_25%,rgba(167,180,119,0.05),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(140,118,80,0.07),transparent_38%)]"
      />
      <SiteHeader
        navItems={navItems}
        profileName={profile.name}
        currentLocale={locale}
      />
      <div
        className={`mx-auto grid w-full max-w-[1500px] grid-cols-1 items-stretch gap-8 px-4 py-10 sm:px-6 lg:px-10 ${
          showSidebar
            ? "lg:grid-cols-[clamp(240px,20vw,280px)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto] lg:min-h-[calc(100svh-61px)]"
            : ""
        }`}
      >
        {showSidebar ? (
          <SideProfileCard
            profile={profile}
            locale={locale}
            contactHref={contactEmail ? `mailto:${contactEmail}` : undefined}
            contactLabel={contactEmail || undefined}
          />
        ) : null}
        <main className="flex min-w-0 flex-col">{children}</main>
        <div className={showSidebar ? "lg:col-start-2" : "mt-16"}>
          <SiteFooter lastUpdated={lastUpdated} locale={locale} />
        </div>
      </div>
    </div>
  );
}
