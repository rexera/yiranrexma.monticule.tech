"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

import type { TocEntry } from "@/lib/mdx";

type TableOfContentsProps = {
  entries: TocEntry[];
  title?: string;
};

type TocGroup = {
  heading: TocEntry;
  children: TocEntry[];
};

/** Pixels below the viewport top at which a heading counts as "current". */
const ACTIVE_OFFSET = 112;

function groupEntries(entries: TocEntry[]): TocGroup[] {
  const groups: TocGroup[] = [];
  for (const entry of entries) {
    if (entry.depth === 2 || groups.length === 0) {
      groups.push({ heading: entry, children: [] });
    } else {
      groups[groups.length - 1].children.push(entry);
    }
  }
  return groups;
}

/**
 * Sticky margin table of contents with scroll-spy and progressive
 * disclosure (the VitePress/Stripe-docs pattern): level-2 sections are
 * always visible, and each section's level-3 items expand only while that
 * section is the one being read — so the rail stays short and never needs
 * a scrollbar of its own.
 */
export function TableOfContents({ entries, title = "On this page" }: TableOfContentsProps) {
  const groups = useMemo(() => groupEntries(entries), [entries]);
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return;

    // Cheap enough to run directly on scroll (a few dozen cached-layout
    // reads); rAF throttling would stall in tabs that don't paint frames.
    const update = () => {
      let current: string | null = null;
      for (const { id } of entries) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          current = id;
        } else {
          break;
        }
      }
      // At the very bottom of the page, the last section wins even if its
      // heading never reached the offset line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = entries[entries.length - 1]?.id ?? current;
      }
      setActiveId(current ?? entries[0]?.id ?? null);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [entries]);

  if (entries.length === 0) {
    return null;
  }

  // The open group is the one containing the active heading (an active h2
  // opens its own group; an active h3 opens its parent's).
  const openGroup = groups.find(
    (group) => group.heading.id === activeId || group.children.some((child) => child.id === activeId)
  ) ?? groups[0];

  const linkClasses = (active: boolean) =>
    clsx(
      "-ml-px block border-l-2 py-1 pr-2 text-[0.8125rem] leading-snug transition-colors",
      active
        ? "border-brand font-medium text-brand"
        : "border-transparent text-slate-500 hover:border-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
    );

  return (
    <nav aria-label="Table of contents" className="sticky top-24 w-full pb-8">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <ul className="mt-4 border-l border-slate-200 dark:border-slate-800">
        {groups.map((group) => {
          const open = group === openGroup;
          return (
            <li key={group.heading.id}>
              <a
                href={`#${group.heading.id}`}
                aria-current={group.heading.id === activeId ? "location" : undefined}
                className={clsx(linkClasses(group.heading.id === activeId), "pl-3.5")}
              >
                {group.heading.text}
              </a>
              {group.children.length > 0 ? (
                <div
                  className={clsx(
                    "grid transition-all duration-300 ease-out",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <ul className="overflow-hidden">
                    {group.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          aria-current={child.id === activeId ? "location" : undefined}
                          tabIndex={open ? undefined : -1}
                          className={clsx(linkClasses(child.id === activeId), "pl-7")}
                        >
                          {child.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
