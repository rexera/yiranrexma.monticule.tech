"use client";

import { useEffect, useRef, useState } from "react";

type MermaidDiagramProps = {
  code: string;
};

let renderCounter = 0;

/**
 * Client-side Mermaid renderer. The library is dynamically imported so it
 * never enters the server bundle; diagrams re-render on theme change.
 */
export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const dark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: dark ? "dark" : "default",
          fontFamily: "inherit"
        });
        renderCounter += 1;
        const { svg } = await mermaid.render(`mmd-${renderCounter}`, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (failed) {
    return (
      <pre className="not-prose my-6 overflow-x-auto bg-ink/[0.04] p-4 text-[0.85rem] leading-relaxed text-ink/80">
        {code}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="not-prose my-6 flex justify-center overflow-x-auto border border-line/20 bg-paper p-6 [&_svg]:max-w-full"
    />
  );
}
