"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.07-7.07L19 5m-14 14-1.07 1.07M5 5l-1.07-1.07M19 19l1.07 1.07" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
    </svg>
  );
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    const doc = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    // `finished` rejects when a newer transition interrupts this one (rapid
    // toggling); the theme is already applied either way, so just swallow it.
    doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    }).finished.catch(() => {});
  };

  // Keep the label stable through hydration; the icon itself is driven by
  // the `dark` class, so only this text needs the mounted guard.
  const label = !mounted
    ? "Toggle colour theme"
    : isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink dark:hover:bg-white/[0.06]"
    >
      {/* Both icons are rendered; the `dark` class decides which one is
          visible, so the first paint already matches the stored theme. The
          crescent's ink centre sits 2.69 units up-right of the viewBox
          centre (the sun's is dead centre), so it is shifted to match. */}
      <MoonIcon className="h-[18px] w-[18px] -translate-x-[2px] translate-y-[2px] dark:hidden" />
      <SunIcon className="hidden h-[18px] w-[18px] dark:block" />
    </button>
  );
}
