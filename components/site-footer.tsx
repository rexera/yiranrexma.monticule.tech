import Image from "next/image";

import type { LocaleProfile } from "@/lib/content-types";
import { typographic } from "@/lib/smart-quotes";

type Locale = "en" | "zh";

type SiteFooterProps = {
  profile: LocaleProfile;
  email?: string;
  lastUpdated?: string;
  locale?: Locale;
};

const QR_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/wechat_oa.JPG": { width: 430, height: 430 },
  "/images/xiaohongshu.JPG": { width: 987, height: 1347 },
  "/images/douyin.JPG": { width: 1125, height: 1680 }
};

/**
 * Closing block: a direct contact line, the social accounts that have no
 * public URL (QR on hover/focus), and a single quiet rule of provenance.
 */
export function SiteFooter({ profile, email, lastUpdated, locale = "en" }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const repositoryUrl = process.env.NEXT_PUBLIC_REPOSITORY_URL;
  const copy = {
    en: {
      contact: "Contact",
      talk: "Let's talk.",
      elsewhere: "Elsewhere",
      copyright: `© ${year} Yiran Rex Ma`,
      viewSource: "Source",
      lastUpdated: "Last updated",
      top: "Back to top",
      tagline: "artist, engineer, human."
    },
    zh: {
      contact: "联系",
      talk: "不吝珠玉",
      elsewhere: "别处",
      copyright: `© ${year} 马义然`,
      viewSource: "源码",
      lastUpdated: "最近更新",
      top: "回到顶部",
      tagline: "artist, engineer, human."
    }
  } satisfies Record<Locale, Record<string, string>>;
  const t = typographic(copy)[locale];

  return (
    <footer className="mt-20 border-t border-line/15 pb-10 pt-12 print:hidden">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div>
            <p className="eyebrow">{t.contact}</p>
            <p className="mt-3 text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
              {t.talk}
            </p>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="link-underline mt-2 inline-block text-sm text-muted hover:text-ink"
              >
                {email}
              </a>
            ) : null}
          </div>

          <nav aria-label={t.elsewhere} className="sm:text-right">
            <p className="eyebrow">{t.elsewhere}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm sm:justify-end">
              {profile.social.map((link) => {
                if (link.qr) {
                  const dims = QR_DIMENSIONS[link.qr] ?? { width: 430, height: 430 };
                  return (
                    <li key={link.label}>
                      <span
                        tabIndex={0}
                        className="group relative inline-flex cursor-default items-center gap-1 text-muted transition-colors hover:text-ink focus-visible:text-ink"
                      >
                        {link.label}
                        <span aria-hidden="true" className="text-[0.7em] opacity-60">
                          QR
                        </span>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none invisible absolute bottom-full right-0 z-50 mb-3 w-40 translate-y-1 border border-line/20 bg-paper p-2 opacity-0 transition-[opacity,transform] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                        >
                          <Image
                            src={link.qr}
                            alt=""
                            width={dims.width}
                            height={dims.height}
                            className="h-auto w-full"
                          />
                        </span>
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline text-muted hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line/15 pt-5 text-xs text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
          <span>{t.copyright}</span>
          {repositoryUrl ? (
            <a href={repositoryUrl} target="_blank" rel="noreferrer" className="link-underline hover:text-ink">
              {t.viewSource}
            </a>
          ) : null}
          {lastUpdated ? (
            <span>
              {t.lastUpdated} <span className="font-mono tabular-nums">{lastUpdated}</span>
            </span>
          ) : null}
          <span className="sm:ml-auto">{t.tagline}</span>
          <a href="#top" className="link-underline hover:text-ink">
            {t.top} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
