"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { MoonIcon, SunIcon } from "@/components/icons";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

type ThemeWindow = Window & {
  __applyTheme?: () => void;
  __themeOverride?: "light" | "dark";
};

/**
 * Light/dark follows the system colour scheme, applied before first paint by
 * the inline script in app/layout.tsx. The button pins a scheme for the
 * current visit only — the override lives in memory, so a reload (or a new
 * tab) goes back to whatever the system is set to. Nothing is stored.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next: "light" | "dark" = isDark ? "light" : "dark";
    const win = window as ThemeWindow;
    win.__themeOverride = next;

    const apply = () => {
      win.__applyTheme?.();
      setIsDark(next === "dark");
    };

    const doc = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    // `finished` rejects when a newer transition interrupts this one (rapid
    // toggling); the theme is already applied either way, so just swallow it.
    doc.startViewTransition(() => {
      flushSync(apply);
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
      <MoonIcon className="h-[18px] w-[18px] dark:hidden" />
      <SunIcon className="hidden h-[18px] w-[18px] dark:block" />
    </button>
  );
}
