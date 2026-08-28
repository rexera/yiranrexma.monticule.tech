"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { buildLocalePath, IS_BILINGUAL, LOCALE_COOKIE_NAME, type Locale } from "@/lib/locale";
import type { NavItem } from "@/types/navigation";

type SiteHeaderProps = {
  navItems: NavItem[];
  profileName?: string;
  currentLocale?: Locale;
};

function stripLocalePrefix(pathname: string) {
  const match = pathname.match(/^\/(en|zh)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] || "/";
}

/**
 * Global horizontal navigation bar with language toggle and theme switcher.
 * Sticks to the top across desktop and mobile.
 */
export function SiteHeader({ navItems, profileName, currentLocale = "en" }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const homeHref = navItems[0]?.href ?? "/";

  const renderLink = (item: NavItem, variant: "desktop" | "mobile") => {
    const normalizedPathname = (pathname ?? "/").replace(/\/$/, "") || "/";
    const normalizedHref = String(item.href).replace(/\/$/, "") || "/";
    const isRootLike = normalizedHref === "/" || /^\/(en|zh)$/.test(normalizedHref);
    const active = !item.external && (isRootLike
      ? normalizedPathname === normalizedHref
      : normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`));
    const baseClasses =
      variant === "desktop"
        ? "rounded-full px-4 py-2 text-sm font-medium transition-colors"
        : "whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-colors";

    const activeClasses =
      variant === "desktop"
        ? "bg-slate-900 text-white shadow-sm hover:bg-slate-900 hover:text-white dark:bg-white dark:text-slate-900 dark:hover:bg-white dark:hover:text-slate-900"
        : "bg-slate-900 text-white hover:bg-slate-900 hover:text-white dark:bg-white dark:text-slate-900 dark:hover:bg-white dark:hover:text-slate-900";

    const inactiveClasses =
      variant === "desktop"
        ? "text-slate-600/80 hover:bg-slate-200/80 hover:text-slate-900 dark:text-slate-200/80 dark:hover:bg-white/10 dark:hover:text-white"
        : "text-slate-600/80 hover:bg-slate-200/80 dark:text-slate-200/80 dark:hover:bg-white/10";

    const className = `${baseClasses} ${active ? activeClasses : inactiveClasses}`;

    // External items (e.g. the standalone CV) open in a new tab and never
    // take over the current page.
    if (item.external) {
      return (
        <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className={className}>
          {item.label}
        </a>
      );
    }

    return (
      <Link key={item.href} href={item.href as any} className={className}>
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 text-slate-700 shadow-[0_10px_40px_-30px_rgba(15,23,42,0.4)] backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-6">
          <Link
            href={homeHref as any}
            className="inline-flex items-baseline gap-2 text-sm font-semibold text-slate-700/90 hover:text-slate-900 dark:text-slate-200/90 dark:hover:text-white"
            aria-label={profileName ?? "Academic Homepage"}
          >
            {/* viewBox cropped to the exact artwork bounds, so the colored
                mark fills the box. h-[1cap] sizes it to the font's cap
                height; with items-baseline the mark's bottom sits on the
                text baseline and its top on the cap line — flush with the
                glyphs on both edges. */}
            <Image src="/images/monticule-icon.svg" alt="" width={874} height={272} className="h-[1cap] w-auto shrink-0" />
            <span className="whitespace-nowrap">{profileName ?? "Academic Homepage"}</span>
          </Link>
          <nav className="hidden items-center gap-3 md:flex">
            {navItems.map((item) => renderLink(item, "desktop"))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {IS_BILINGUAL ? (
            <div className="flex items-center gap-1 rounded-full border border-slate-300 bg-white/70 p-1 text-xs font-semibold text-slate-600/80 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-200/80">
              {(
                [
                  { label: "EN", value: "en" as Locale },
                  { label: "中文", value: "zh" as Locale }
                ] as const
              ).map((option) => {
                const active = currentLocale === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const current = pathname ?? "/";
                      const stripped = stripLocalePrefix(current);
                      const nextPath = buildLocalePath(option.value, stripped);

                      // Persist user preference for proxy redirects and future visits.
                      document.cookie = `${LOCALE_COOKIE_NAME}=${option.value}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
                      router.push(nextPath as any);
                    }}
                    className={`rounded-full px-2.5 py-1 transition ${
                      active
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-600/80 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          <ThemeToggle variant="subtle" />
        </div>
      </div>
      <nav className="flex items-center gap-2 overflow-x-auto border-t border-slate-200 px-4 py-2 scrollbar-hide sm:px-6 md:hidden dark:border-slate-800">
        {navItems.map((item) => renderLink(item, "mobile"))}
      </nav>
    </header>
  );
}
