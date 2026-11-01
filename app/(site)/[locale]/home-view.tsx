import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ArrowLink } from "@/components/arrow-link";
import { ExternalLinkIcon } from "@/components/icons";
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
  const subtitle = [profile.nativeName, ...(profile.location ? profile.location.split("·") : [])]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return (
    <div className="container-page pb-4 pt-10 sm:pt-14">
      <section className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-start sm:gap-12">
        <div className="relative min-w-0">
          <div className="enter-clip absolute right-0 top-0 block aspect-[4/5] w-[76px] overflow-hidden bg-brand/10 sm:hidden">
            <Image
              src={profile.avatar ?? "/images/profile.webp"}
              alt=""
              fill
              priority
              sizes="76px"
              className="object-cover object-top"
            />
          </div>
          <h1 className="home-name pr-24 font-display text-[clamp(2.5rem,4vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink sm:pr-0">
            <span
              className="enter-mask"
              style={{ "--enter-delay": "0ms" } as CSSProperties}
            >
              <span>{profile.name}</span>
            </span>
          </h1>

          <p
            className="enter-up mt-3 flex flex-wrap items-baseline text-sm tracking-normal text-muted"
            style={{ "--enter-delay": "100ms" } as CSSProperties}
          >
            {subtitle.map((part, index) => (
              <span key={`${part}-${index}`}>
                {index > 0 ? <span aria-hidden="true" className="dot-separator">·</span> : null}
                {part}
              </span>
            ))}
          </p>

          <div
            className="enter-up mt-7 max-w-[62ch] space-y-2.5"
            style={{ "--enter-delay": "220ms" } as CSSProperties}
          >
            {copy.leads.map((lead) => (
              <p key={lead} className="text-[16px] leading-[1.7] text-ink/75">
                {lead}
              </p>
            ))}
          </div>

          {profile.keywords?.length ? (
            <p
              className="enter-up mt-6 max-w-[62ch] text-sm leading-relaxed tracking-normal text-muted"
              style={{ "--enter-delay": "300ms" } as CSSProperties}
            >
              <span className="mr-3 font-mono text-[11px] tracking-[0.08em] text-brand-text">
                {locale === "zh" ? "最近关注" : "Curious about"}
              </span>
              {profile.keywords.map((keyword, index) => (
                <span key={keyword}>
                  {index > 0 ? <span aria-hidden="true" className="dot-separator">·</span> : null}
                  {keyword}
                </span>
              ))}
            </p>
          ) : null}
        </div>

        <div
          className="enter-clip relative hidden aspect-[4/5] w-[200px] overflow-hidden bg-brand/10 sm:ml-auto sm:block"
          style={{ "--enter-delay": "260ms" } as CSSProperties}
        >
          <Image
            src={profile.avatar ?? "/images/profile.webp"}
            alt={profile.name}
            fill
            priority
            sizes="200px"
            className="object-cover object-top"
          />
        </div>
      </section>

      <div className="mt-16 space-y-20">
        <section>
          <Reveal>
            <SectionHeading
              title={copy.sections.work}
              note={locale === "zh" ? "Selected work" : "研究成果"}
              action={<ArrowLink href={`${base}/publications`}>{copy.sections.all}</ArrowLink>}
            />
          </Reveal>
          <div className="mt-3">
            {publications.map((item, index) => (
              <Reveal key={item.id} delay={index * 45} className="border-b border-line/10">
                <PublicationRow item={item} locale={locale} compact />
              </Reveal>
            ))}
          </div>
        </section>

        <section>
          <Reveal>
            <SectionHeading
              title={copy.sections.news}
              note={locale === "zh" ? "Notes & news" : "最近动态"}
            />
          </Reveal>
          <Reveal delay={60}>
            <ol className="mt-3">
              {updates.map((entry) => {
                const external = isExternal(entry.link);
                const titleClass =
                  "link-underline text-[0.98rem] font-medium leading-snug text-ink hover:text-brand-text";
                return (
                  <li
                    key={`${entry.date}-${entry.title}`}
                    className="grid gap-1.5 border-b border-line/10 py-6 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-6"
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
                              {entry.title}
                              <ExternalLinkIcon className="ml-1 inline h-3.5 w-3.5 align-[-0.15em] text-muted" />
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
              title={copy.sections.writing}
              note={locale === "zh" ? "Writing" : "长文与笔记"}
              action={<ArrowLink href={`${base}/blog`}>{copy.sections.all}</ArrowLink>}
            />
          </Reveal>
          <Reveal delay={60}>
            <ol className="mt-3">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="grid gap-1.5 border-b border-line/10 py-6 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-6"
                >
                  <time className="font-mono text-[11px] tabular-nums tracking-[0.08em] text-muted">
                    {formatDate(post.date)}
                  </time>
                  <div>
                    <Link
                      href={`${base}/blog/${post.slug}` as any}
                      className="link-underline text-[0.98rem] font-medium leading-snug text-ink hover:text-brand-text"
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
