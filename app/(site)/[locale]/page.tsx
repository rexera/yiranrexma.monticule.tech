import { notFound } from "next/navigation";

import { HomeClient } from "./home-client";

import { getHomePageCopy, getProfileContent, getUpdatesContent } from "@/lib/content";
import { getRecentCommits } from "@/lib/commits";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const profile = getProfileContent()[locale];
  const updates = getUpdatesContent()[locale].updates;
  const copy = getHomePageCopy()[locale];
  const commits = await getRecentCommits();

  return (
    <HomeClient
      locale={locale}
      profile={profile}
      updates={updates}
      copy={copy}
      commits={commits}
    />
  );
}
