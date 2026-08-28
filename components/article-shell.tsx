import Link from "next/link";
import type { ReactNode } from "react";

import { GiscusComments } from "@/components/giscus-comments";

type Locale = "en" | "zh";

type ArticleShellProps = {
  locale: Locale;
  backLabel: string;
  backHref: string;
  title: string;
  meta?: ReactNode;
  toc?: ReactNode;
  children: ReactNode;
};

/**
 * Shared layout for long-form pages (blog posts, publication details).
 * The reading column is centered on the page at a fixed 46rem measure —
 * one width token for the back link, title block, article body, and
 * comments, so their left edges line up exactly (a ch-based width would
 * compute differently for the 16px chrome and the 17px article). The TOC
 * lives in the margin to the right on xl screens, sticky while scrolling.
 */
export function ArticleShell({ locale, backLabel, backHref, title, meta, toc, children }: ArticleShellProps) {
  return (
    <div className="space-y-8">
      <div className="mx-auto w-full max-w-[46rem]">
        <Link
          href={backHref as any}
          className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 py-1.5 pl-2 pr-4 text-sm font-medium text-slate-600 transition hover:border-brand/60 hover:text-brand dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-brand/70 dark:hover:text-brand"
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-hover:bg-brand/15 group-hover:text-brand dark:bg-slate-800 dark:text-slate-300"
          >
            ←
          </span>
          {backLabel}
        </Link>
      </div>

      <header className="mx-auto w-full max-w-[46rem] space-y-3 border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        {meta}
      </header>

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-10">
        <article className="prose mdx-article mx-auto min-w-0 w-full max-w-[46rem] xl:col-start-2 xl:mx-0">
          {children}
        </article>
        <div className="hidden xl:col-start-3 xl:block">
          {toc}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[46rem]">
        <GiscusComments locale={locale} />
      </div>
    </div>
  );
}
