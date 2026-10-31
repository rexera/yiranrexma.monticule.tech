import Link from "next/link";

import { AbstractToggle } from "@/components/abstract-toggle";
import type { PublicationEntry } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";

type PublicationRowProps = {
  item: PublicationEntry;
  locale?: Locale;
  compact?: boolean;
};

const TYPE_LABELS: Record<Locale, Record<PublicationEntry["type"], string>> = {
  en: { C: "Conference", J: "Journal", P: "Patent", S: "Preprint" },
  zh: { C: "会议", J: "期刊", P: "专利", S: "预印本" }
};

// Decorative scan aid only — the text label beside the dot stays muted so
// contrast never depends on the accent palette (raw VI tones are not AA-safe
// as text on paper).
const TYPE_MARKERS: Record<PublicationEntry["type"], string> = {
  C: "bg-brand",
  J: "bg-brand",
  P: "bg-brand",
  S: "bg-vi-ground"
};

const ABSTRACT_LABELS = {
  en: { open: "Abstract", close: "Hide abstract" },
  zh: { open: "摘要", close: "收起摘要" }
} as const;

/**
 * One publication as an editorial row, sharing the blog list's anatomy: a
 * narrow mono meta column (type marker + id) beside the content column. The
 * hairline belongs to the list wrapper; the hover tint bleeds slightly past
 * it via negative margins so the hairline stays aligned with the toolbar.
 */
export function PublicationRow({ item, locale = "en", compact = false }: PublicationRowProps) {
  const typeLabel = TYPE_LABELS[locale]?.[item.type] ?? item.type;
  const detailHref = item.slug ? `/${locale}/publications/${item.slug}` : null;
  const title = detailHref ? (
    <Link
      href={detailHref as any}
      className="link-underline transition-colors hover:text-brand-text"
    >
      {item.title}
    </Link>
  ) : (
    item.title
  );

  return (
    <article className="-mx-3 px-3 py-6 transition-colors duration-200 hover:bg-ink/[0.03] dark:hover:bg-white/[0.04] sm:-mx-4 sm:px-4">
      <div className="grid gap-1.5 sm:grid-cols-[108px_minmax(0,1fr)] sm:gap-8">
        <div className="flex items-baseline gap-2 sm:block">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${TYPE_MARKERS[item.type]}`}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {typeLabel}
            </span>
          </span>
          <span className="font-mono text-[11px] tabular-nums tracking-[0.08em] text-muted sm:mt-1.5 sm:block">
            {item.id}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="text-[1.05rem] font-semibold leading-snug text-ink">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.authors}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{item.venue}</p>
          {item.links?.length ? (
            <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {item.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-muted transition-colors hover:text-brand-text"
                >
                  {link.label} ↗
                </a>
              ))}
            </p>
          ) : null}
          {!compact && item.tags?.length ? (
            <p className="mt-2 text-xs text-muted">{item.tags.join(" · ")}</p>
          ) : null}
          {!compact && item.notes ? (
            <AbstractToggle text={item.notes} labels={ABSTRACT_LABELS[locale]} />
          ) : null}
        </div>
      </div>
    </article>
  );
}
