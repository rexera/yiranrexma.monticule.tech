"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import type { UpdateEntry } from "@/lib/content-types";

type TimelineFeedProps = {
  items: UpdateEntry[];
  className?: string;
};

function parseDateToMs(value: string) {
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}

/**
 * Scrollable activity feed for the Home page — a dense news list: date and
 * title on one line, summary beneath, hairline dividers between entries,
 * no rail or dots, so the content gets the full card width. The bottom fade
 * is an overlay pinned to the card (not a sticky child of the scroll flow)
 * and fades out once the reader reaches the last entry.
 */
export function TimelineFeed({ items, className }: TimelineFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

  const entries = [...items].sort((a, b) => parseDateToMs(b.date) - parseDateToMs(a.date));

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const update = () => {
      setAtBottom(scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8);
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [entries.length]);

  if (!entries.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
        Updates will appear here soon. Stay tuned!
      </div>
    );
  }

  return (
    <div className={clsx("absolute inset-0", className)}>
      <div
        ref={scrollRef}
        className="timeline-scroll absolute inset-0 overflow-y-auto rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-[0_32px_80px_-50px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900"
      >
        <ol className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.map((entry) => {
            const href = entry.link || undefined;
            const body = (
              <>
                <p className="flex flex-wrap items-baseline gap-x-2.5">
                  <time className="text-xs font-semibold tabular-nums text-brand">{entry.date}</time>
                  <span
                    className={clsx(
                      "text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50",
                      href && "transition-colors group-hover:text-brand"
                    )}
                  >
                    {entry.title}
                  </span>
                </p>
                {entry.summary ? (
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-slate-600 dark:text-slate-300">
                    {entry.summary}
                  </p>
                ) : null}
              </>
            );

            return (
              <li key={`${entry.date}-${entry.title}`} className="py-3 first:pt-0 last:pb-0">
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="group block"
                  >
                    {body}
                  </a>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-3xl bg-gradient-to-t from-white to-transparent transition-opacity duration-300 dark:from-slate-900",
          atBottom ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}
