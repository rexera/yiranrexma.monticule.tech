import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { Table } from "@/components/table";
import { Timeline } from "@/components/timeline";
import {
  getAwardsContent,
  getCVPageCopy,
  getProfileContent,
  getPublicationsContent,
  getTimelineContent
} from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

const CONTACT_EMAIL_B64 = process.env.NEXT_PUBLIC_CONTACT_EMAIL_B64 ?? "";

function decodeContactEmail() {
  if (!CONTACT_EMAIL_B64) return "";
  try {
    return Buffer.from(CONTACT_EMAIL_B64.trim(), "base64").toString("utf8");
  } catch {
    return "";
  }
}

/**
 * Standalone web CV. The page itself is the canonical document — printing it
 * from the browser produces a clean PDF via the global print stylesheet.
 */
export default async function CVPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const profile = getProfileContent()[locale];
  const timeline = getTimelineContent()[locale];
  const awards = getAwardsContent()[locale].awards;
  const publications = [...getPublicationsContent()[locale].entries].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );
  const t = getCVPageCopy()[locale];
  const email = decodeContactEmail();

  const skillsHeaders = [...t.skills.headers];
  const skillsRows = t.skills.rows.map((row) => [...row]);

  return (
    <div className="space-y-16">
      <Section title={t.intro.title}>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/60 print:border-none print:bg-transparent print:p-0">
          <div className="space-y-1">
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              {profile.name}
              {profile.nativeName ? <span className="ml-2 text-base text-slate-600 dark:text-slate-300">{profile.nativeName}</span> : null}
            </p>
            <p className="text-base text-slate-700 dark:text-slate-200">{profile.title}</p>
            <p className="text-base text-slate-600 dark:text-slate-300">{profile.affiliation}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {email ? (
              <span>
                {t.intro.emailLabel}:{" "}
                <a href={`mailto:${email}`} className="text-brand hover:text-brand-foreground">
                  {email}
                </a>
              </span>
            ) : null}
            <span>{profile.location}</span>
            {profile.social.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:text-brand-foreground print:hidden"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section title={t.education.title}>
        <Timeline items={timeline.education} />
      </Section>

      <Section title={t.experience.title}>
        <Timeline items={timeline.experience} />
      </Section>

      <Section title={t.publications.title}>
        <ol className="space-y-5">
          {publications.map((entry) => (
            <li key={entry.id} className="space-y-1">
              <p className="text-base font-medium leading-snug text-slate-900 dark:text-slate-50">
                {entry.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {entry.authors}. <em>{entry.venue}</em>, {entry.year}.
              </p>
              {entry.links?.length ? (
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {entry.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand hover:text-brand-foreground"
                    >
                      {link.label}
                    </a>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      {awards.length > 0 ? (
        <Section title={t.honors.title}>
          <Table headers={[...t.honors.headers]} rows={awards.map((award) => [award.year, award.title, award.issuer])} />
        </Section>
      ) : null}

      <Section title={t.skills.title}>
        <Table headers={skillsHeaders} rows={skillsRows} />
      </Section>
    </div>
  );
}
