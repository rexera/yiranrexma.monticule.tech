"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { FilterToolbar } from "@/components/filter-toolbar";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import type { BlogPostMeta, BlogPostType } from "@/lib/blog-types";
import type { BlogPageCopy } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";

type BlogPostWithYear = BlogPostMeta & { year: string };

type BlogClientProps = {
  copy: BlogPageCopy[Locale];
  posts: BlogPostMeta[];
  locale: Locale;
};

const ALL_FILTER_VALUE = "all" as const;

// Decorative scan aid only — the text label beside the dot stays muted so
// contrast never depends on the accent palette (raw VI tones are not AA-safe
// as text on paper).
const TYPE_MARKERS: Record<BlogPostType, string> = {
  research: "bg-brand",
  note: "bg-vi-ground"
};

export function BlogClient({ copy, posts, locale }: BlogClientProps) {
  const [typeFilter, setTypeFilter] = useState<string>(ALL_FILTER_VALUE);
  const [yearFilter, setYearFilter] = useState<string>(ALL_FILTER_VALUE);
  const base = `/${locale}`;

  const normalizedPosts = useMemo<BlogPostWithYear[]>(() => {
    return posts
      .map((post) => ({
        ...post,
        year: new Date(post.date).getFullYear().toString()
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  const yearOptions = useMemo(() => {
    const uniqueYears = Array.from(new Set(normalizedPosts.map((post) => post.year))).sort(
      (a, b) => Number(b) - Number(a)
    );
    return [ALL_FILTER_VALUE, ...uniqueYears];
  }, [normalizedPosts]);

  const typeOptions = (Object.keys(copy.types) as BlogPostType[]).map((type) => ({
    value: type,
    label: copy.types[type]
  }));

  const typeCounts = useMemo(() => {
    const pool = normalizedPosts.filter((post) => yearFilter === ALL_FILTER_VALUE || post.year === yearFilter);
    return Object.fromEntries([
      [ALL_FILTER_VALUE, pool.length],
      ...typeOptions.map((option) => [
        option.value,
        pool.filter((post) => post.type === option.value).length
      ])
    ]) as Record<string, number>;
  }, [normalizedPosts, typeOptions, yearFilter]);

  const yearCounts = useMemo(() => {
    const pool = normalizedPosts.filter(
      (post) => typeFilter === ALL_FILTER_VALUE || post.type === typeFilter
    );
    return Object.fromEntries(
      yearOptions.map((year) => [
        year,
        year === ALL_FILTER_VALUE ? pool.length : pool.filter((post) => post.year === year).length
      ])
    ) as Record<string, number>;
  }, [normalizedPosts, typeFilter, yearOptions]);

  const filteredPosts = useMemo(() => {
    return normalizedPosts.filter((post) => {
      const matchesType = typeFilter === ALL_FILTER_VALUE || post.type === typeFilter;
      const matchesYear = yearFilter === ALL_FILTER_VALUE || post.year === yearFilter;
      return matchesType && matchesYear;
    });
  }, [normalizedPosts, typeFilter, yearFilter]);

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

      <div className="mt-8">
        <FilterToolbar
          groups={[
            {
              id: "type",
              label: copy.filters.type,
              value: typeFilter,
              options: [
                { value: ALL_FILTER_VALUE, label: copy.filters.all, count: typeCounts[ALL_FILTER_VALUE] },
                ...typeOptions.map((option) => ({
                  ...option,
                  count: typeCounts[option.value]
                }))
              ],
              onChange: setTypeFilter
            },
            {
              id: "year",
              label: copy.filters.year,
              value: yearFilter,
              options: yearOptions.map((year) => ({
                value: year,
                label: year === ALL_FILTER_VALUE ? copy.filters.all : year,
                count: yearCounts[year]
              })),
              onChange: setYearFilter
            }
          ]}
        />
      </div>

      {filteredPosts.length ? (
        <div className="mt-2 border-t border-line/15">
          {filteredPosts.map((post, index) => {
            return (
              <Reveal key={post.slug} delay={Math.min(index, 5) * 40} className="border-b border-line/15">
                <article className="-mx-3 px-3 py-6 transition-colors duration-200 hover:bg-ink/[0.03] dark:hover:bg-white/[0.04] sm:-mx-4 sm:px-4">
                  <div className="grid gap-1.5 sm:grid-cols-[108px_minmax(0,1fr)] sm:gap-8">
                    <div className="flex items-baseline gap-2 sm:block">
                      <time className="font-mono text-[11px] tabular-nums tracking-[0.08em] text-muted">
                        {post.date}
                      </time>
                      <span className="inline-flex items-center gap-1.5 sm:mt-1.5 sm:block">
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${TYPE_MARKERS[post.type]}`}
                        />
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                          {copy.types[post.type]}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[1.05rem] font-semibold leading-snug text-ink">
                        <Link
                          href={`${base}/blog/${post.slug}` as any}
                          className="link-underline transition-colors hover:text-brand-text"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      {post.summary ? (
                        <p className="mt-1 line-clamp-2 max-w-[68ch] text-sm leading-relaxed text-muted">
                          {post.summary}
                        </p>
                      ) : null}
                      {post.tags.length ? (
                        <p className="mt-2 text-xs text-muted">{post.tags.join(" · ")}</p>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">{copy.empty}</p>
      )}
    </div>
  );
}
