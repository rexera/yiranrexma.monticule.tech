"use client";

import { useEffect } from "react";

import { buildLocalePath, DEFAULT_LOCALE, resolveEntryLocale, type Locale } from "@/lib/locale";

function detectLocaleFromNavigator(): Locale {
  const language = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase();
  if (language.startsWith("zh")) return "zh";
  if (language.startsWith("en")) return "en";
  if (language.includes("zh")) return "zh";
  if (language.includes("en")) return "en";
  return DEFAULT_LOCALE;
}

type LocaleRedirectProps = {
  /**
   * Path after the locale segment.
   * Examples:
   * - "" -> "/en" or "/zh"
   * - "/research" -> "/en/research" or "/zh/research"
   */
  pathAfterLocale?: string;
  title?: string;
};

export function LocaleRedirect({
  pathAfterLocale = "",
  title = "Redirecting..."
}: LocaleRedirectProps) {
  useEffect(() => {
    // Static-export platforms cannot run proxy.ts at request time, so these
    // fallback pages detect locale in the browser and redirect on the client.
    // Nothing is stored: every visit re-reads the system language.
    const locale = resolveEntryLocale({
      detectedLocale: detectLocaleFromNavigator()
    });

    window.location.replace(buildLocalePath(locale, pathAfterLocale));
  }, [pathAfterLocale]);

  const fallbackTarget = buildLocalePath(DEFAULT_LOCALE, pathAfterLocale);

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-ink">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-3 text-sm text-muted">
        If you are not redirected automatically,{" "}
        <a className="link-underline" href={fallbackTarget}>
          continue
        </a>
        .
      </p>
      <noscript>
        <p className="mt-3 text-sm text-muted">
          JavaScript is required for locale auto-detection on this entry route.
        </p>
      </noscript>
    </main>
  );
}
