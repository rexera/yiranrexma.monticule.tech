"use client";

import { useEffect } from "react";

/**
 * Visual lazy-load for long MDX bodies: blocks that sit below the first
 * viewport fade-and-rise in as the reader reaches them, so a long essay
 * composes progressively instead of landing all at once.
 *
 * MDX children are server-rendered nodes, so unlike <Reveal> this scans the
 * DOM for `.mdx-article` containers and works on their direct children. Only
 * blocks below the fold get tagged — what is already visible at load is left
 * untouched, avoiding a flash of already-visible content. The hidden state
 * lives in CSS behind `@media (scripting: enabled)`, so content stays fully
 * visible without JS; reduced motion bails out here and in CSS.
 */
export function ArticleReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks: HTMLElement[] = [];
    for (const container of document.querySelectorAll(".mdx-article")) {
      for (const block of container.children) {
        if (!(block instanceof HTMLElement)) continue;
        if (block.getBoundingClientRect().top > window.innerHeight * 0.9) {
          blocks.push(block);
        }
      }
    }
    if (blocks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    blocks.forEach((block, index) => {
      block.setAttribute("data-reveal", "");
      block.style.setProperty("--reveal-delay", `${Math.min(index * 30, 120)}ms`);
      observer.observe(block);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
