"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import { Timeline } from "@/components/timeline";
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
 * Scrollable activity feed for the Home page. Reuses the shared Timeline
 * visual; only the viewport is specific here. The bottom fade is an overlay
 * pinned to the card (not a sticky child of the scroll flow), on a solid
 * background — so it can never seam against the card — and it fades out
 * once the reader reaches the last entry.
 */
export function TimelineFeed({ items, className }: TimelineFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

  const entries = [...items]
    .sort((a, b) => parseDateToMs(b.date) - parseDateToMs(a.date))
    .map((update) => ({
      title: update.title,
      period: update.date,
      location: update.type,
      details: update.summary ? [update.summary] : [],
      href: update.link || undefined
    }));

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    let hideTimer: number | undefined;

    const update = () => {
      setAtBottom(scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8);
    };

    const onScroll = () => {
      update();
      // Reveal the scrollbar while scrolling; it fades back out when idle.
      scroller.classList.add("is-scrolling");
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => scroller.classList.remove("is-scrolling"), 700);
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      observer.disconnect();
      window.clearTimeout(hideTimer);
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
        className="timeline-scroll absolute inset-0 overflow-y-auto rounded-3xl border border-slate-200 bg-white px-6 py-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <Timeline items={entries} />
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
