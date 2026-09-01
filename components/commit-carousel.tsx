"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

import type { CommitItem } from "@/lib/commits";

type CommitCarouselProps = {
  commits: CommitItem[];
  title: string;
};

const GAP = 16;
/** Smallest card we accept before dropping one from the visible row. */
const MIN_CARD = 232;
const STEP_MS = 380;
/** Horizontal drag (px) that commits a step on release. */
const RELEASE_THRESHOLD = 56;
/** Trackpad deltaX accumulated before it counts as a step. */
const WHEEL_STEP = 60;

/**
 * Commit strip for the Home page: N cards visible (fluid width, filling the
 * column exactly), switched by swiping / trackpad / arrow keys one card at
 * a time. Each step the strip translates by one card; the outgoing head
 * card fades out toward the left while the next card fades in from the
 * right — no continuous scrolling and no clip edge.
 */
export function CommitCarousel({ commits, title }: CommitCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const wheelAcc = useRef(0);
  const wheelReset = useRef<number | undefined>(undefined);
  const [layout, setLayout] = useState({ vis: 4, cardW: 256 });
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState<number | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const total = commits.length;
  const maxIndex = Math.max(0, total - layout.vis);
  const stride = layout.cardW + GAP;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => {
      // clientWidth includes the horizontal padding (px-8 × 2 = 64) that
      // gives the edge cards' shadows room to diffuse past the column; the
      // card row only fills the content box.
      const width = viewport.clientWidth - 64;
      if (!width) return;
      const vis = Math.max(1, Math.floor((width + GAP) / (MIN_CARD + GAP)));
      setLayout({ vis, cardW: (width - (vis - 1) * GAP) / vis });
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setIndex((current) => Math.max(0, Math.min(maxIndex, current + direction)));
    },
    [maxIndex]
  );

  // Horizontal trackpad swipes: accumulate deltaX into discrete steps and
  // let vertical scrolling fall through to the page.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      wheelAcc.current += event.deltaX;
      window.clearTimeout(wheelReset.current);
      wheelReset.current = window.setTimeout(() => (wheelAcc.current = 0), 180);
      if (wheelAcc.current >= WHEEL_STEP) {
        wheelAcc.current = 0;
        step(1);
      } else if (wheelAcc.current <= -WHEEL_STEP) {
        wheelAcc.current = 0;
        step(-1);
      }
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelReset.current);
    };
  }, [step]);

  // Drag offset with rubber-banding past either end.
  let drag = dx ?? 0;
  if (dx !== null) {
    if (index === 0 && dx > 0) drag = dx * 0.25;
    if (index === maxIndex && dx < 0) drag = dx * 0.25;
  }
  const progress = dx === null ? 0 : Math.max(-1, Math.min(1, drag / stride));

  const opacityFor = (i: number) => {
    if (dx === null) {
      return i >= index && i < index + layout.vis ? 1 : 0;
    }
    // While dragging, the cards about to leave/enter fade proportionally
    // to how far the step has been pulled.
    if (progress < 0) {
      if (i === index) return 1 + progress;
      if (i === index + layout.vis) return -progress;
    } else if (progress > 0) {
      if (i === index - 1) return progress;
      if (i === index + layout.vis - 1) return 1 - progress;
    }
    return i >= index && i < index + layout.vis ? 1 : 0;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const onPointerDown = (event: React.PointerEvent) => {
    dragStart.current = event.clientX;
    setGrabbing(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic/inactive pointer — drag tracking works without capture.
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (dragStart.current === null) return;
    setDx(event.clientX - dragStart.current);
  };

  const endDrag = (event: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    setGrabbing(false);
    setDx(null);
    if (delta <= -RELEASE_THRESHOLD) step(1);
    else if (delta >= RELEASE_THRESHOLD) step(-1);
  };

  if (total === 0) {
    return null;
  }

  return (
    <section tabIndex={0} onKeyDown={onKeyDown} aria-roledescription="carousel" aria-label={title}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
          <span
            className="ml-3 font-mono text-xs font-medium tracking-normal text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          >
            {Math.min(index + 1, total)}–{Math.min(index + layout.vis, total)} / {total}
          </span>
        </h2>
      </div>

      {/* overflow clips at the padding edge: the pt/pb (+ matching negative
          margins) give the card shadows room to diffuse vertically at zero
          layout cost, and px-8/-mx-8 does the same on both sides — edge
          cards' shadows diffuse 32px past the column edges instead of being
          cut, keeping the strip's bottom edge flush with the sidebar. */}
      <div
        ref={viewportRef}
        className="-mx-8 -mb-6 -mt-2 touch-pan-y select-none overflow-hidden px-8 pb-6 pt-2"
        style={{ cursor: grabbing ? "grabbing" : "grab" }}
        role="group"
        aria-live="polite"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={() => {
          dragStart.current = null;
          setDx(null);
          setGrabbing(false);
        }}
      >
        <div
          className={clsx("flex gap-4", dx === null && "transition-transform duration-[380ms] ease-[cubic-bezier(0.2,0,0,1)]")}
          style={{ transform: `translateX(${-index * stride + drag}px)` }}
        >
          {commits.map((commit, i) => (
            <a
              key={commit.sha}
              href={commit.href}
              target="_blank"
              rel="noreferrer"
              draggable={false}
              className="flex shrink-0 snap-start flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_10px_30px_rgba(26,33,24,0.08)] transition hover:border-brand/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] dark:hover:border-brand/60"
              style={{
                width: layout.cardW,
                opacity: opacityFor(i),
                transition: dx === null ? "opacity 240ms ease, border-color 150ms ease" : "none",
                pointerEvents: i >= index && i < index + layout.vis ? "auto" : "none"
              }}
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
      </div>
    </section>
  );
}
