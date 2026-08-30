import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicationsClient } from "@/app/(site)/publications/publications-client";
import { getProjectsContent, getPublicationsContent, getPublicationsPageCopy } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yiranrexma.monticule.tech";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale) ?? "en";
  const title = locale === "zh" ? "成果与项目" : "Publications & Projects";
  return {
    title,
    alternates: {
      canonical: `${SITE_URL}/${locale}/publications`,
      languages: {
        en: `${SITE_URL}/en/publications`,
        zh: `${SITE_URL}/zh/publications`,
        "x-default": `${SITE_URL}/en/publications`
      }
    }
  };
}

export default async function PublicationsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const entries = [...getPublicationsContent()[locale].entries].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );
  const projects = getProjectsContent()[locale].groups.flatMap((group) => group.items);
  const copy = getPublicationsPageCopy()[locale];

  return <PublicationsClient entries={entries} projects={projects} locale={locale} copy={copy} />;
}
