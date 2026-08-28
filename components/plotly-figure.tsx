"use client";

import { useEffect, useRef } from "react";

type PlotlyFigureProps = {
  /** JSON spec: `{ "data": [...], "layout": {...} }` or a bare data array. */
  spec: string;
};

/**
 * Client-side Plotly renderer for ```plotly fences. plotly.js is dynamically
 * imported and never SSR'd; the container has an explicit height because
 * markdown flow has none.
 */
export function PlotlyFigure({ spec }: PlotlyFigureProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;

    (async () => {
      let parsed: { data?: unknown; layout?: Record<string, unknown> };
      try {
        parsed = JSON.parse(spec);
      } catch {
        return;
      }

      const Plotly = (await import("plotly.js-dist-min")).default;
      if (disposed || !containerRef.current) return;

      const dark = document.documentElement.classList.contains("dark");
      const data = Array.isArray(parsed) ? parsed : (parsed.data ?? []);
      const layout = {
        height: 460,
        margin: { t: 40, r: 24, b: 44, l: 56 },
        ...(Array.isArray(parsed) ? {} : (parsed.layout ?? {})),
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: dark ? "#c9c2ae" : "#4a5842", family: "inherit" }
      } as Record<string, unknown>;

      await Plotly.newPlot(containerRef.current, data as never, layout as never, {
        responsive: true
      });
    })();

    return () => {
      disposed = true;
    };
  }, [spec]);

  return (
    <div
      ref={containerRef}
      className="not-prose my-6 w-full rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60"
      style={{ minHeight: 460 }}
    />
  );
}
