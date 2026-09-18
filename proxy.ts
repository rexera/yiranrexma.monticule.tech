import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { buildLocalePath, LOCALES, LOCALE_COOKIE_NAME, normalizeLocale, resolveEntryLocale, type Locale } from "@/lib/locale";

function detectLocaleFromAcceptLanguage(value: string | null): Locale | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  // Example: "zh-CN,zh;q=0.9,en;q=0.8"
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("en")) return "en";
  if (normalized.includes("zh")) return "zh";
  if (normalized.includes("en")) return "en";
  return null;
}

function hasLocalePrefix(pathname: string) {
  return LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

// Paths the site has moved, keyed by their old path after the locale segment.
// Request-time deployments get a redirect here; static exports fall back to
// the page each old path keeps under app/(redirects) and app/(site).
const RENAMED_PATHS: Record<string, string> = {
  "/experience": "/story"
};

function renamedTarget(pathname: string): string | null {
  for (const [from, to] of Object.entries(RENAMED_PATHS)) {
    if (pathname === from) return to;
    if (pathname.startsWith(`${from}/`)) return `${to}${pathname.slice(from.length)}`;
  }
  return null;
}

// This request-time redirect layer is intended for deployments that support
// Next.js proxy/middleware behavior, such as Vercel.
//
// For static-export deployments (for example EdgeOne with EDGEONE=1), the
// app/(redirects) route tree provides client-side fallback redirects instead.
//
// We only redirect "real" site routes. This avoids doubling random scanner
// traffic (e.g. /_layouts/*, /terraform.tfstate, /.well-known/*).
function isSupportedRoute(pathname: string) {
  if (pathname === "/") return true;
  const roots = ["/research", "/publications", "/projects", "/story", "/blog", "/contact"] as const;
  return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already localized: a moved path redirects straight to its new home.
  if (hasLocalePrefix(pathname)) {
    for (const locale of LOCALES) {
      if (pathname !== `/${locale}` && !pathname.startsWith(`/${locale}/`)) continue;
      // +1 for the leading slash the locale sits behind.
      const moved = renamedTarget(pathname.slice(locale.length + 1));
      if (moved) {
        return NextResponse.redirect(new URL(`/${locale}${moved}`, request.url), 308);
      }
      break;
    }
    return NextResponse.next();
  }

  const moved = renamedTarget(pathname);
  if (!moved && !isSupportedRoute(pathname)) {
    return NextResponse.next();
  }

  const cookieLocale = normalizeLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value);
  const headerLocale = detectLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const locale = resolveEntryLocale({
    cookieLocale,
    detectedLocale: headerLocale
  });

  const url = request.nextUrl.clone();
  url.pathname = buildLocalePath(locale, moved ?? (pathname === "/" ? "" : pathname));

  const response = NextResponse.redirect(url);
  if (!cookieLocale) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax"
    });
  }
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and direct file requests (static assets).
    "/((?!_next/|api/|.*\\..*).*)"
  ]
};

// Export both named and default forms because some deployment adapters expect
// the default export, while the Next.js runtime reads the named export.
export default proxy;
