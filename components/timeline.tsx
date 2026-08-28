import clsx from "clsx";

import type { TimelineEntry } from "@/lib/content-types";

type TimelineItem = TimelineEntry & {
  /** When set, the whole entry becomes a link (external links open in a new tab). */
  href?: string;
};

type TimelineProps = {
  items: TimelineItem[];
  /** Tighter type and spacing for space-constrained viewports (Home feed). */
  compact?: boolean;
};

/**
 * Vertical timeline used for education, professional experience, and the
 * Home page updates feed. One shared visual language: a single hairline
 * rail, brand dot with halo, and the date first — directly beside the dot,
 * in the strongest ink — then title, location, and bulleted details.
 */
export function Timeline({ items, compact = false }: TimelineProps) {
  const text = {
    period: compact ? "text-[0.8125rem]" : "text-sm",
    title: compact ? "text-[0.9375rem]" : "text-lg",
    location: compact ? "text-xs" : "text-sm",
    detail: compact ? "text-[0.8125rem]" : "text-sm",
    dot: compact ? "h-2 w-2" : "h-2.5 w-2.5",
    dotTop: compact ? "top-1" : "top-1.5",
    titleGap: compact ? "mt-0.5" : "mt-1.5",
    detailGap: compact ? "mt-1.5" : "mt-2.5",
    detailSpace: compact ? "space-y-1" : "space-y-1.5"
  };

  return (
    <ul className={clsx("relative pl-4 sm:pl-6", compact ? "space-y-5" : "space-y-8")}>
      <span className="pointer-events-none absolute left-1 top-2 bottom-2 hidden w-px bg-slate-200 dark:bg-slate-700 sm:block" aria-hidden="true" />
      {items.map((item) => {
        const inner = (
          <>
            <p className={clsx("font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-50", text.period)}>
              {item.period}
            </p>
            <h3
              className={clsx(
                "font-semibold leading-snug text-slate-900 dark:text-slate-50",
                text.title,
                text.titleGap,
                item.href && "transition group-hover:text-brand"
              )}
            >
              {item.title}
            </h3>
            {item.location ? (
              <p className={clsx("mt-0.5 text-slate-600 dark:text-slate-300", text.location)}>
                {item.location}
              </p>
            ) : null}
            <ul className={clsx("leading-relaxed text-slate-600 dark:text-slate-300", text.detail, text.detailGap, text.detailSpace)}>
              {item.details.map((detail, idx) => (
                <li key={idx} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </>
        );

        return (
          <li key={`${item.period}-${item.title}`} className="relative pl-6 sm:pl-9">
            <span
              className={clsx("timeline-dot absolute left-0 rounded-full bg-brand/80 sm:left-[-2px]", text.dot, text.dotTop)}
              aria-hidden="true"
            />
            {item.href ? (
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group block"
              >
                {inner}
              </a>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
