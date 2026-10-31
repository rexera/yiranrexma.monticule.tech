import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ArrowLink } from "@/components/arrow-link";
import { PublicationRow } from "@/components/publication-row";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { BlogPostMeta } from "@/lib/blog-types";
import type { HomePageCopy, LocaleProfile, PublicationEntry, UpdateEntry } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";

type HomeViewProps = {
  locale: Locale;
  profile: LocaleProfile;
  updates: UpdateEntry[];
  publications: PublicationEntry[];
  posts: BlogPostMeta[];
  copy: HomePageCopy[Locale];
};

function formatDate(value: string) {
  return value.split("-").join(".");
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function HomeView({ locale, profile, updates, publications, posts, copy }: HomeViewProps) {
  const base = `/${locale}`;
  // One line, several parts: the native name and each segment of the location
  // ("中国·北京" → 中国, 北京) get the same flex gap around the separators, so
  // the line never crowds at a CJK middle dot.
  const subtitle = [profile.nativeName, ...(profile.location ? profile.location.split("·") : [])]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return (
    <div className="container-page pb-4 pt-10 sm:pt-14">
      <section className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_180px] sm:items-start sm:gap-12">
        <div className="min-w-0">
          <h1 className="text-[clamp(2rem,3.4vw,2.8rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink">
            <span
              className="enter-mask"
              style={{ "--enter-delay": "0ms" } as CSSProperties}
            >
              <span>{profile.name}</span>
            </span>
          </h1>

          <p
            className="enter-up mt-2 flex flex-wrap items-baseline gap-x-3 text-sm tracking-normal text-muted"
            style={{ "--enter-delay": "100ms" } as CSSProperties}
          >
            {subtitle.map((part, index) => (
              <span key={`${part}-${index}`} className="inline-flex items-baseline gap-x-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-line/50">
                    ·
                  </span>
                ) : null}
                {part}
              </span>
            ))}
          </p>

          <ul
            className="enter-up mt-6 max-w-[62ch] space-y-2.5 text-[17px] leading-[1.7] text-ink/80"
            style={{ "--enter-delay": "220ms" } as CSSProperties}
          >
            {copy.leads.map((lead) => (
              <li key={lead}>{lead}</li>
            ))}
          </ul>

          {profile.keywords?.length ? (
            <p
              className="enter-up mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 text-sm tracking-normal text-muted"
              style={{ "--enter-delay": "300ms" } as CSSProperties}
            >
              {profile.keywords.map((keyword, index) => (
                <span key={keyword} className="inline-flex items-baseline gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-line/50">
                      ·
                    </span>
                  ) : null}
                  {keyword}
                </span>
              ))}
            </p>
          ) : null}
        </div>

        <div
          className="enter-clip relative hidden aspect-[4/5] w-[180px] overflow-hidden bg-ink/[0.04] sm:ml-auto sm:block"
          style={{ "--enter-delay": "260ms" } as CSSProperties}
        >
          <Image
            src={profile.avatar ?? "/images/profile.webp"}
            alt={profile.name}
            fill
            priority
            sizes="180px"
            className="object-cover object-top"
          />
        </div>
      </section>

      <div className="mt-14 space-y-14">
        <section>
          <Reveal>
            <SectionHeading
              index="01"
              title={copy.sections.work}
              action={<ArrowLink href={`${base}/publications`}>{copy.sections.all}</ArrowLink>}
            />
          </Reveal>
          <div className="mt-2 border-t border-line/15">
            {publications.map((item, index) => (
              <Reveal key={item.id} delay={index * 45} className="border-b border-line/15">
                <PublicationRow item={item} locale={locale} compact />
              </Reveal>
            ))}
          </div>
        </section>

        <section>
          <Reveal>
            <SectionHeading index="02" title={copy.sections.news} />
          </Reveal>
          <Reveal delay={60}>
            <ol className="mt-2 border-t border-line/15">
              {updates.map((entry) => {
                const external = isExternal(entry.link);
                const titleClass =
                  "link-underline text-[0.98rem] font-medium leading-snug text-ink hover:text-brand-600 dark:hover:text-brand-300";
                return (
                  <li
                    key={`${entry.date}-${entry.title}`}
                    className="grid gap-1.5 border-b border-line/15 py-4 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-6"
                  >
                    <time className="font-mono text-[11px] tabular-nums tracking-[0.08em] text-muted">
                      {formatDate(entry.date)}
                    </time>
                    <div>
                      <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="eyebrow">{entry.type}</span>
                        {entry.link ? (
                          external ? (
                            <a href={entry.link} target="_blank" rel="noreferrer" className={titleClass}>
                              {entry.title} <span aria-hidden="true" className="text-muted">↗</span>
                            </a>
                          ) : (
                            <Link href={entry.link as any} className={titleClass}>
                              {entry.title}
                            </Link>
                          )
                        ) : (
                          <span className="text-[0.98rem] font-medium leading-snug text-ink">
                            {entry.title}
                          </span>
                        )}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                        {entry.summary}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </section>

        <section>
          <Reveal>
            <SectionHeading
              index="03"
              title={copy.sections.writing}
              action={<ArrowLink href={`${base}/blog`}>{copy.sections.all}</ArrowLink>}
            />
          </Reveal>
          <Reveal delay={60}>
            <ol className="mt-2 border-t border-line/15">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="grid gap-1.5 border-b border-line/15 py-4 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-6"
                >
                  <time className="font-mono text-[11px] tabular-nums tracking-[0.08em] text-muted">
                    {formatDate(post.date)}
                  </time>
                  <div>
                    <Link
                      href={`${base}/blog/${post.slug}` as any}
                      className="link-underline text-[0.98rem] font-medium leading-snug text-ink hover:text-brand-600 dark:hover:text-brand-300"
                    >
                      {post.title}
                    </Link>
                    {post.summary ? (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                        {post.summary}
                      </p>
                    ) : null}
                    {post.tags.length ? (
                      <p className="mt-1.5 text-xs text-muted">{post.tags.join(" · ")}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
