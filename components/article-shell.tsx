import Link from "next/link";
import type { ReactNode } from "react";

import { ArticleReveal } from "@/components/article-reveal";
import { GiscusComments } from "@/components/giscus-comments";
import { ArrowLeftIcon } from "@/components/icons";
import { ReadingProgress } from "@/components/reading-progress";
import { ScrollToHash } from "@/components/scroll-to-hash";

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
 * One 1000px block: header and body share a 46rem column, and the TOC sits
 * in the right margin of that block, sticky while the article scrolls.
 */
export function ArticleShell({ locale, backLabel, backHref, title, meta, toc, children }: ArticleShellProps) {
  const hasToc = Boolean(toc);

  return (
    <div className="container-page py-8 sm:py-12">
      <ReadingProgress />
      <ArticleReveal />
      <ScrollToHash />

      <div className={hasToc ? "mx-auto w-full max-w-[1000px]" : "mx-auto w-full max-w-[46rem]"}>
        <div
          className={
            hasToc
              ? "mx-auto w-full max-w-[46rem] xl:mx-0 xl:max-w-none xl:pr-[268px]"
              : "w-full"
          }
        >
          <Link
            href={backHref as any}
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="link-underline">{backLabel}</span>
          </Link>

          <header className="mt-8 border-b border-line/10 pb-6">
            <h1 className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.03em] text-ink">
              {title}
            </h1>
            {meta ? <div className="mt-4">{meta}</div> : null}
          </header>
        </div>

        <div className={hasToc ? "mt-8 xl:grid xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-12" : "mt-8"}>
          <div
            className={
              hasToc
                ? "mx-auto w-full min-w-0 max-w-[46rem] xl:mx-0 xl:max-w-none"
                : "w-full min-w-0"
            }
          >
            <article className="prose mdx-article min-w-0 w-full max-w-none">{children}</article>
            <div className="mt-12">
              <GiscusComments locale={locale} />
            </div>
          </div>
          {hasToc ? <aside className="hidden xl:block">{toc}</aside> : null}
        </div>
      </div>
    </div>
  );
}
