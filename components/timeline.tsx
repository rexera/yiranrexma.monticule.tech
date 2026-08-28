import type { TimelineEntry } from "@/lib/content-types";

type TimelineItem = TimelineEntry & {
  /** When set, the whole entry becomes a link (external links open in a new tab). */
  href?: string;
};

type TimelineProps = {
  items: TimelineItem[];
};

/**
 * Vertical timeline used for education, professional experience, and the
 * Home page updates feed. One shared visual language: a single hairline
 * rail, brand dot with halo, and the date first — directly beside the dot,
 * in the strongest ink — then title, location, and bulleted details.
 */
export function Timeline({ items }: TimelineProps) {
  return (
    <ul className="relative space-y-8 pl-4 sm:pl-6">
      <span className="pointer-events-none absolute left-1 top-2 bottom-2 hidden w-px bg-slate-200 dark:bg-slate-700 sm:block" aria-hidden="true" />
      {items.map((item) => {
        const inner = (
          <>
            <p className="text-sm font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
              {item.period}
            </p>
            <h3
              className={`mt-1.5 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50 ${
                item.href ? "transition group-hover:text-brand" : ""
              }`}
            >
              {item.title}
            </h3>
            {item.location ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.location}</p>
            ) : null}
            <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
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
            <span className="timeline-dot absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-brand/80 sm:left-[-2px]" aria-hidden="true" />
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
