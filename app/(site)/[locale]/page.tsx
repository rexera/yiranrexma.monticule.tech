import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeClient } from "./home-client";

import { getHomePageCopy, getProfileContent, getUpdatesContent } from "@/lib/content";
import { getRecentCommits } from "@/lib/commits";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yiranrexma.monticule.tech";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale) ?? "en";
  return {
    alternates: {
      canonical: locale === "zh" ? `${SITE_URL}/zh` : `${SITE_URL}/en`,
      languages: {
        en: `${SITE_URL}/en`,
        zh: `${SITE_URL}/zh`,
        "x-default": `${SITE_URL}/en`
      }
    }
  };
}

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

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: [profile.nativeName, profile.aka].filter(Boolean),
    jobTitle: profile.title,
    affiliation: { "@type": "Organization", name: profile.affiliation },
    url: locale === "zh" ? `${SITE_URL}/zh` : `${SITE_URL}/en`,
    email: `mailto:${copy.highlights.contactValue}`,
    sameAs: profile.social.filter((link) => link.href).map((link) => link.href)
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: SITE_URL,
    inLanguage: locale === "zh" ? "zh-CN" : "en"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, websiteJsonLd]) }}
      />
      <HomeClient
        locale={locale}
        profile={profile}
        updates={updates}
        copy={copy}
        commits={commits}
      />
    </>
  );
}
