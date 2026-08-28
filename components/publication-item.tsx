import Link from "next/link";

import { ExternalLinkIcon } from "@/components/icons";
import { Tag } from "@/components/tag";
import type { PublicationEntry } from "@/lib/content-types";

type Locale = "en" | "zh";

type PublicationItemProps = {
  item: PublicationEntry;
  locale?: Locale;
};

const TYPE_LABELS: Record<Locale, Record<PublicationEntry["type"], string>> = {
  en: {
    C: "Conference",
    J: "Journal",
    P: "Patent",
    S: "Preprint"
  },
  zh: {
    C: "会议",
    J: "期刊",
    P: "专利",
    S: "预印本"
  }
};

/**
 * Publication card. When the entry has a detail page (slug), a stretched
 * link covers the whole card; external links sit above it with z-index, so
 * anchors stay siblings (no nested <a>) and both remain clickable.
 */
export function PublicationItem({ item, locale = "en" }: PublicationItemProps) {
  const typeLabel = TYPE_LABELS[locale]?.[item.type] ?? item.type;
  const detailHref = item.slug ? `/${locale}/publications/${item.slug}` : null;

  return (
    <article className="group relative space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-5 text-left shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] transition dark:border-slate-800 dark:bg-slate-900/70 [&:has(a:hover)]:border-slate-300">
      {detailHref ? (
        <Link
          href={detailHref as any}
          aria-label={item.title}
          className="absolute inset-0 z-0 rounded-2xl transition group-hover:-translate-y-0.5 group-hover:border-brand/50"
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
        <div className="flex flex-wrap items-center gap-2">
          <Tag label={typeLabel} />
          <span className="tabular-nums">{item.year}</span>
        </div>
        <span className="text-slate-600 dark:text-slate-300">{item.id}</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {item.title}
          {detailHref ? (
            <span className="ml-2 inline-block text-sm font-normal text-brand opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true">
              →
            </span>
          ) : null}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {item.authors}
          {item.notes ? <span className="ml-2 text-slate-500">({item.notes})</span> : null}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{item.venue}</p>
      </div>
      {item.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      ) : null}
      {item.links?.length ? (
        <div className="relative z-10 flex flex-wrap gap-3 text-sm font-medium">
          {item.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand hover:text-brand-foreground"
            >
              {link.label}
              <ExternalLinkIcon aria-hidden="true" className="h-4 w-4" />
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
