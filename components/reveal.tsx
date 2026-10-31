"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children?: ReactNode;
};

/**
 * Adds the `is-in` class the first time the element enters the viewport.
 * The hidden state lives in CSS behind `@media (scripting: enabled)`, so
 * content stays visible without JS and is reset under reduced motion.
 */
export function Reveal({ as = "div", delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      element.classList.add("is-in");
      return;
    }

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

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The cast keeps JSX happy while `as` still chooses the rendered tag;
  // the ref is a plain HTMLElement at runtime either way.
  const Component = as as "div";

  return (
    <Component
      ref={ref}
      data-reveal=""
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
