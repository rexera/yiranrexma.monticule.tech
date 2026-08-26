import siteJson from "@/content/site.json";

export type Locale = "en" | "zh";
type LocaleMode = "bilingual" | "en-only" | "zh-only";

const ALL_LOCALES = ["en", "zh"] as const satisfies readonly Locale[];
const rawMode = (siteJson as { i18n?: { mode?: string } }).i18n?.mode;
const rawPrimaryLocale = (siteJson as { i18n?: { primaryLocale?: string } }).i18n?.primaryLocale;

function normalizeMode(value: string | undefined): LocaleMode {
  if (value === "en-only" || value === "zh-only" || value === "bilingual") {
    return value;
  }
  return "bilingual";
}

function normalizePrimaryLocale(value: string | undefined): Locale | null {
  if (value === "en" || value === "zh") {
    return value;
  }
  return null;
}

export const LOCALE_MODE = normalizeMode(rawMode);
export const PRIMARY_LOCALE = normalizePrimaryLocale(rawPrimaryLocale);
export const AUTO_DETECT_LOCALE = LOCALE_MODE === "bilingual" && PRIMARY_LOCALE === null;
export const DEFAULT_LOCALE: Locale =
  LOCALE_MODE === "en-only"
    ? "en"
    : LOCALE_MODE === "zh-only"
      ? "zh"
      : PRIMARY_LOCALE ?? "en";

export const LOCALES =
  LOCALE_MODE === "en-only"
    ? (["en"] as const)
    : LOCALE_MODE === "zh-only"
      ? (["zh"] as const)
      : ALL_LOCALES;

export const LOCALE_COOKIE_NAME = "locale";
export const IS_BILINGUAL = LOCALES.length > 1;

export function isLocale(value: unknown): value is Locale {
  return (LOCALES as readonly string[]).includes(String(value));
}

export function normalizeLocale(value: unknown): Locale | null {
  if (isLocale(value)) {
    return value;
  }
  return null;
}

export function getFallbackLocale(locale: Locale): Locale {
  if (!IS_BILINGUAL) {
    return DEFAULT_LOCALE;
  }
  return locale === "zh" ? "en" : "zh";
}

export function buildLocalePath(locale: Locale, pathAfterLocale = "") {
  const suffix = pathAfterLocale
    ? pathAfterLocale.startsWith("/")
      ? pathAfterLocale
      : `/${pathAfterLocale}`
    : "";
  return suffix ? `/${locale}${suffix}` : `/${locale}`;
}


export function resolveEntryLocale({
  cookieLocale,
  detectedLocale
}: {
  cookieLocale?: Locale | null;
  detectedLocale?: Locale | null;
}): Locale {
  const normalizedCookie = normalizeLocale(cookieLocale);
  if (normalizedCookie) {
    return normalizedCookie;
  }

  if (AUTO_DETECT_LOCALE) {
    const normalizedDetected = normalizeLocale(detectedLocale);
    if (normalizedDetected) {
      return normalizedDetected;
    }
  }

  return DEFAULT_LOCALE;
}
