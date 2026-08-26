import Link from "next/link";

type Locale = "en" | "zh";

type SiteFooterProps = {
  lastUpdated?: string;
  locale?: Locale;
};

/**
 * Global footer with copyright, update info, and quick links.
 */
export function SiteFooter({ lastUpdated, locale = "en" }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const repositoryUrl = process.env.NEXT_PUBLIC_REPOSITORY_URL;
  const copy = {
    en: {
      copyright: `© ${year} Academic Homepage Template.`,
      viewSource: "View source on GitHub",
      lastUpdated: "Last updated:",
      tagline: "Built for researchers"
    },
    zh: {
      copyright: `© ${year} 学术主页模板。`,
      viewSource: "GitHub 源码仓库",
      lastUpdated: "上次更新：",
      tagline: "为研究者而构建"
    }
  } satisfies Record<Locale, { copyright: string; viewSource: string; lastUpdated: string; tagline: string }>;
  const t = copy[locale];

  return (
    <footer className="mt-16 border-t border-slate-200 py-8 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 print:hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span>{t.copyright}</span>
          {repositoryUrl ? (
            <Link
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-brand"
            >
              {t.viewSource}
            </Link>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {lastUpdated ? <span>{t.lastUpdated} {lastUpdated}</span> : null}
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand/20 dark:text-brand/90">
            {t.tagline}
          </span>
        </div>
      </div>
    </footer>
  );
}
