"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ACTIVE_OFFSET } from "@/components/toc";
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
 * Where the reader is, as a section anchor — `s4`, or `s4-2` for a
 * subsection. That is the only way to address a section that means the same
 * thing in both locales: the heading ids themselves are the localized heading
 * text. Prefer the section the reader jumped to; when they simply scrolled,
 * take the last heading past ACTIVE_OFFSET — the rule the table of contents
 * uses for its active item.
 */
function currentSection() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash) {
    if (/^s\d+(-\d+)?$/.test(hash)) return hash;
    const legacy = document.getElementById(hash);
    if (legacy instanceof HTMLElement && legacy.dataset.s) return legacy.dataset.s;
  }

  let section: string | undefined;
  for (const heading of document.querySelectorAll<HTMLElement>("[data-s]")) {
    if (heading.getBoundingClientRect().top > ACTIVE_OFFSET) break;
    section = heading.dataset.s;
  }
  return section;
}

/**
 * Masthead that scrolls away with the page (deliberately not sticky): one
 * hairline, a small wordmark, text navigation, and a menu panel on narrow
 * screens. The active item keeps a short rule under it; hover draws one in.
 */
export function SiteHeader({ navItems, profileName, currentLocale = "en" }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const homeHref = navItems[0]?.href ?? "/";
  const uiLabels =
    currentLocale === "zh"
      ? { here: "当前", language: "语言" }
      : { here: "Here", language: "Language" };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (item: NavItem) => {
    const normalizedPathname = (pathname ?? "/").replace(/\/$/, "") || "/";
    const normalizedHref = String(item.href).replace(/\/$/, "") || "/";
    const isRootLike = normalizedHref === "/" || /^\/(en|zh)$/.test(normalizedHref);
    return (
      !item.external &&
      (isRootLike
        ? normalizedPathname === normalizedHref
        : normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`))
    );
  };

  const localeButtons = (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      {(
        [
          { label: "EN", value: "en" as Locale },
          { label: "中文", value: "zh" as Locale }
        ] as const
      ).map((option, index) => {
        const active = currentLocale === option.value;
        return (
          <span key={option.value} className="flex items-center gap-1.5">
            {index > 0 ? <span className="text-line/30" aria-hidden="true">/</span> : null}
            <button
              type="button"
              aria-pressed={active}
              onClick={() => {
                const current = pathname ?? "/";
                const stripped = stripLocalePrefix(current);
                const section = currentSection();
                const nextPath = `${buildLocalePath(option.value, stripped)}${
                  section ? `#${section}` : ""
                }`;
                document.cookie = `${LOCALE_COOKIE_NAME}=${option.value}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
                router.push(nextPath as any);
              }}
              className={clsx(
                "transition-colors",
                active ? "text-ink" : "text-muted hover:text-ink"
              )}
            >
              {option.label}
            </button>
          </span>
        );
      })}
    </div>
  );

  const renderDesktopLink = (item: NavItem) => {
    const active = isActive(item);
    // The active item keeps a persistent rule; only idle items get the
    // draw-in hover underline, so hovering the current tab never shows two.
    const classes = clsx(
      "relative py-1 text-sm",
      active ? "text-ink" : "link-underline text-muted hover:text-ink"
    );
    const underline = active ? (
      <span aria-hidden="true" className="absolute inset-x-0 -bottom-0.5 h-px bg-ink" />
    ) : null;

    if (item.external) {
      return (
        <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className={classes}>
          {item.label}
          {underline}
        </a>
      );
    }

    return (
      <Link key={item.href} href={item.href as any} aria-current={active ? "page" : undefined} className={classes}>
        {item.label}
        {underline}
      </Link>
    );
  };

  const renderMobileLink = (item: NavItem) => {
    const active = isActive(item);
    const classes = "flex items-baseline justify-between border-b border-line/10 py-3";
    const body = (
      <>
        <span className={clsx("text-lg font-medium", active ? "text-ink" : "text-muted")}>
          {item.label}
        </span>
        {active ? <span className="eyebrow">{uiLabels.here}</span> : null}
      </>
    );

    if (item.external) {
      return (
        <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className={classes} onClick={() => setOpen(false)}>
          {body}
        </a>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href as any}
        aria-current={active ? "page" : undefined}
        className={classes}
        onClick={() => setOpen(false)}
      >
        {body}
      </Link>
    );
  };

  return (
    <header id="top" className="relative z-30 border-b border-line/15">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            href={homeHref as any}
            className="inline-flex items-baseline gap-2 text-sm font-semibold text-ink"
            aria-label={profileName ?? "Academic Homepage"}
          >
            <Image
              src="/images/monticule-icon.svg"
              alt=""
              width={874}
              height={272}
              className="h-[1cap] w-auto shrink-0"
            />
            <span className="whitespace-nowrap">{profileName ?? "Academic Homepage"}</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {navItems.map(renderDesktopLink)}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {IS_BILINGUAL ? <div className="hidden md:block">{localeButtons}</div> : null}
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="relative h-9 w-9 rounded-full text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink md:hidden dark:hover:bg-white/[0.06]"
          >
            <span
              aria-hidden="true"
              className={clsx(
                "absolute left-1/2 top-[14px] h-px w-4 -translate-x-1/2 bg-current transition-transform duration-300",
                open && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              aria-hidden="true"
              className={clsx(
                "absolute left-1/2 top-[20px] h-px w-4 -translate-x-1/2 bg-current transition-transform duration-300",
                open && "-translate-y-[3px] -rotate-45"
              )}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={clsx(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <nav aria-label="Primary mobile" className="container-page flex flex-col pb-5 pt-1">
            {navItems.map(renderMobileLink)}
            {IS_BILINGUAL ? (
              <div className="mt-4 flex items-center justify-between">
                <span className="eyebrow">{uiLabels.language}</span>
                {localeButtons}
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
