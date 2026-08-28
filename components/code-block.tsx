"use client";

import { isValidElement, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { CheckIcon, CopyIcon } from "@/components/icons";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { PlotlyFigure } from "@/components/plotly-figure";

type PreProps = ComponentPropsWithoutRef<"pre">;

function extractText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/**
 * Replaces the MDX <pre> element. Routes ```mermaid and ```plotly fences to
 * interactive renderers; everything else gets a framed block with a header
 * bar (language label + copy button). Light surface in light mode, dark in
 * dark mode; the token colors come from Shiki via CSS variables.
 */
export function CodeBlock({ children }: PreProps) {
  const [copied, setCopied] = useState(false);

  let language = "";
  if (isValidElement(children)) {
    const props = children.props as { className?: string; "data-language"?: string };
    language =
      /language-([\w-]+)/.exec(props.className ?? "")?.[1] ??
      props["data-language"] ??
      "";
  }
  const raw = extractText(children).replace(/\n$/, "");

  if (language === "mermaid") {
    return <MermaidDiagram code={raw} />;
  }
  if (language === "plotly") {
    return <PlotlyFigure spec={raw} />;
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
    } catch {
      // Clipboard API unavailable (insecure context) — legacy fallback.
      const textarea = document.createElement("textarea");
      textarea.value = raw;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        // give up silently; the button still flips back
      }
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-block not-prose group relative my-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/60 py-1.5 pl-4 pr-2 dark:border-white/[0.06] dark:bg-white/[0.03]">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {language || "text"}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.7rem] font-medium text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
        >
          {copied ? (
            <CheckIcon aria-hidden="true" className="h-3.5 w-3.5 text-brand" />
          ) : (
            <CopyIcon aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="soft-scroll overflow-x-auto p-4 font-mono text-[0.85rem] leading-relaxed text-slate-700 dark:text-slate-100 [&_code]:bg-transparent [&_code]:p-0">
        {children}
      </pre>
    </div>
  );
}
