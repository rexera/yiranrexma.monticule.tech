"use client";

import Link from "next/link";

import { CommitCarousel } from "@/components/commit-carousel";
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
    <div className="flex h-full min-h-0 flex-col gap-8">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_32px_80px_-50px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900/70 sm:p-7 print:border-none print:bg-transparent print:shadow-none">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
          <div className="flex flex-col justify-center gap-5">
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {copy.heroIntro}
            </p>
            <div className="flex flex-col gap-3 text-sm font-medium sm:flex-row sm:flex-wrap">
              <Link
                href={`${base}/publications` as any}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 transition-colors hover:border-brand hover:bg-brand hover:text-brand-on dark:border-slate-600 dark:text-slate-200 dark:hover:border-brand dark:hover:bg-brand dark:hover:text-brand-on"
              >
                {copy.buttons.publications}
              </Link>
              <Link
                href={`${base}/blog` as any}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 transition-colors hover:border-brand hover:bg-brand hover:text-brand-on dark:border-slate-600 dark:text-slate-200 dark:hover:border-brand dark:hover:bg-brand dark:hover:text-brand-on"
              >
                {copy.buttons.blog}
              </Link>
            </div>
          </div>
          {/* Same card recipe as the other panels on this page: solid
              surface, slate-200 edge, soft lift — the translucent fill and
              missing shadow made this one read as an unbordered block. */}
          <aside className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_40px_-35px_rgba(0,0,0,0.6)]">
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {copy.highlights.title}
            </h2>
            <dl className="flex flex-1 flex-col justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              {highlightItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-0.5 border-b border-slate-200 pb-2 last:border-b-0 last:pb-0 dark:border-slate-700"
                >
                  <dt className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
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

      {/* Personal news timeline: same visual language as the Story
          page, in a viewport that grows with the window; header matches the
          commits strip below. */}
      <section className="flex min-h-0 flex-1 flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {copy.timeline.title}
        </h2>
        <div className="relative min-h-[380px] flex-1 lg:min-h-[200px]">
          <TimelineFeed items={updates} />
        </div>
      </section>

      {commits && commits.length > 0 ? (
        <CommitCarousel commits={commits} title={copy.commits.title} />
      ) : null}
    </div>
  );
}
