"use client";

import Link from "next/link";

import { CommitCarousel } from "@/components/commit-carousel";
import { Tag } from "@/components/tag";
import { TimelineFeed } from "@/components/timeline-feed";
import type { HomePageCopy, LocaleProfile, UpdateEntry } from "@/lib/content-types";
import type { CommitItem } from "@/lib/commits";
import type { Locale } from "@/lib/locale";

type HomeClientProps = {
  locale: Locale;
  profile: LocaleProfile;
  updates: UpdateEntry[];
  copy: HomePageCopy[Locale];
  commits: CommitItem[] | null;
};

export function HomeClient({ locale, profile, updates, copy, commits }: HomeClientProps) {
  const base = `/${locale}`;

  const highlightItems = [
    { label: copy.highlights.focusLabel, value: copy.highlights.focusValue },
    { label: copy.highlights.contactLabel, value: copy.highlights.contactValue, href: `mailto:${copy.highlights.contactValue}` },
    { label: copy.highlights.locationLabel, value: profile.location }
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-10">
      <section className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_32px_80px_-50px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900/70 print:border-none print:bg-transparent print:shadow-none">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {copy.heroIntro}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.keywords.map((keyword) => (
                <Tag key={keyword} label={keyword} />
              ))}
            </div>
            <div className="flex flex-col gap-3 text-sm font-medium sm:flex-row sm:flex-wrap">
              <Link
                href={`${base}/cv` as any}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {copy.buttons.cv}
              </Link>
              <Link
                href={`${base}/publications` as any}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200"
              >
                {copy.buttons.publications}
              </Link>
              <Link
                href={`${base}/blog` as any}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200"
              >
                {copy.buttons.blog}
              </Link>
            </div>
          </div>
          <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {copy.highlights.title}
            </h2>
            <dl className="flex flex-1 flex-col justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              {highlightItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-slate-700"
                >
                  <dt className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {item.label}
                  </dt>
                  <dd className="text-base font-medium text-slate-900 dark:text-slate-50">
                    {item.href ? (
                      <a href={item.href} className="hover:text-brand dark:hover:text-brand">
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Updates: same timeline language as the Experience page, in a
          viewport pinned to the space the sidebar's height leaves (the
          absolute fill keeps the feed's content from inflating the page,
          so the right column ends flush with the sidebar). */}
      <div className="relative min-h-[420px] flex-1 lg:min-h-[260px]">
        <TimelineFeed items={updates} />
      </div>

      {commits && commits.length > 0 ? (
        <CommitCarousel commits={commits} title={copy.commits.title} />
      ) : null}
    </div>
  );
}
