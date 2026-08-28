"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import type { CommitItem } from "@/lib/commits";

type CommitCarouselProps = {
  commits: CommitItem[];
  title: string;
};

/** px between cards; used to step the arrows by one card. */
const CARD_STRIDE = 256 + 16;

/**
 * Horizontal "latest commits" strip for the Home page: snap-scrolling cards
 * (short sha, date, first line of the message) that open the commit on
 * GitHub, with arrow buttons and the site's auto-hiding scrollbar.
 */
export function CommitCarousel({ commits, title }: CommitCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [updateEdges, commits.length]);

  const step = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * CARD_STRIDE, behavior: "smooth" });
  };

  const arrowClasses = (disabled: boolean) =>
    clsx(
      "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition hover:border-brand/60 hover:text-brand disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-200 disabled:hover:text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300",
      disabled && "opacity-35"
    );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Scroll left" disabled={atStart} onClick={() => step(-1)} className={arrowClasses(atStart)}>
            <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Scroll right" disabled={atEnd} onClick={() => step(1)} className={arrowClasses(atEnd)}>
            <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Padding with matching negative margins, on both axes: overflow
          clips at the padding edge, so the padding gives card shadows room
          to diffuse (and the hover lift) at zero layout cost — the cards'
          edges land flush with the sidebar on every side. The native
          scrollbar is hidden entirely (.commit-track): its classic-mode
          footprint varies by platform and would push the cards off the
          baseline. No space-y here: it would override the negative
          margins. */}
      <div
        ref={trackRef}
        className="commit-track -mx-6 -mt-2 -mb-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-7 pt-2"
      >
        {commits.map((commit) => (
          <a
            key={commit.sha}
            href={commit.href}
            target="_blank"
            rel="noreferrer"
            className="group flex w-64 shrink-0 snap-start flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(26,33,24,0.08)] transition hover:-translate-y-0.5 hover:border-brand/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] dark:hover:border-brand/60"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-mono font-semibold text-brand">{commit.sha.slice(0, 7)}</span>
              <time className="tabular-nums text-slate-400 dark:text-slate-500">{commit.date}</time>
            </div>
            <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-900 dark:text-slate-100">
              {commit.message}
            </p>
            <p className="mt-auto text-xs text-slate-400 dark:text-slate-500">{commit.author}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
