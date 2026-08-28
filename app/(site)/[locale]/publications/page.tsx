import { notFound } from "next/navigation";

import { PublicationsClient } from "@/app/(site)/publications/publications-client";
import { getProjectsContent, getPublicationsContent, getPublicationsPageCopy } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

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
