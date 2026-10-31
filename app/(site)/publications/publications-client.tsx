"use client";

import { useMemo, useState } from "react";

import { FilterToolbar } from "@/components/filter-toolbar";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { PublicationRow } from "@/components/publication-row";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { ProjectEntry, PublicationEntry, PublicationsPageCopy } from "@/lib/content-types";

type Locale = "en" | "zh";

const TYPE_OPTIONS = ["All", "C", "J", "P", "S"] as const;
type TypeFilter = typeof TYPE_OPTIONS[number];

type PublicationsClientProps = {
  entries: PublicationEntry[];
  projects: ProjectEntry[];
  locale: Locale;
  copy: PublicationsPageCopy[Locale];
};

export function PublicationsClient({ entries, projects, locale, copy }: PublicationsClientProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [yearFilter, setYearFilter] = useState<string>("All");

  const years = useMemo(() => {
    const unique = Array.from(new Set(entries.map((entry) => entry.year))).sort((a, b) => Number(b) - Number(a));
    return ["All", ...unique];
  }, [entries]);

  const availableTypes = useMemo(
    () => TYPE_OPTIONS.filter((type) => type === "All" || entries.some((entry) => entry.type === type)),
    [entries]
  );

  const typeCounts = useMemo(() => {
    const pool = entries.filter((entry) => yearFilter === "All" || entry.year === yearFilter);
    return Object.fromEntries(
      TYPE_OPTIONS.map((type) => [
        type,
        type === "All" ? pool.length : pool.filter((entry) => entry.type === type).length
      ])
    ) as Record<TypeFilter, number>;
  }, [entries, yearFilter]);

  const yearCounts = useMemo(() => {
    const pool = entries.filter((entry) => typeFilter === "All" || entry.type === typeFilter);
    return Object.fromEntries(
      years.map((year) => [
        year,
        year === "All" ? pool.length : pool.filter((entry) => entry.year === year).length
      ])
    ) as Record<string, number>;
  }, [entries, typeFilter, years]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const typeMatch = typeFilter === "All" || entry.type === typeFilter;
      const yearMatch = yearFilter === "All" || entry.year === yearFilter;
      return typeMatch && yearMatch;
    });
  }, [entries, typeFilter, yearFilter]);

  const groupedEntries = useMemo(() => {
    const groups = new Map<string, PublicationEntry[]>();
    for (const entry of filteredEntries) {
      const bucket = groups.get(entry.year) ?? [];
      bucket.push(entry);
      groups.set(entry.year, bucket);
    }
    return Array.from(groups.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filteredEntries]);

  const renderTypeLabel = (type: TypeFilter) => {
    if (type === "All") return copy.filters.all;
    return copy.types[type as Exclude<TypeFilter, "All">];
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

      <SectionHeading index="01" title={copy.publicationsTitle} />

      <div className="mt-4">
        <FilterToolbar
          groups={[
            {
              id: "type",
              label: copy.filters.type,
              value: typeFilter,
              options: availableTypes.map((type) => ({
                value: type,
                label: renderTypeLabel(type),
                count: typeCounts[type]
              })),
              onChange: (value) => setTypeFilter(value as TypeFilter)
            },
            {
              id: "year",
              label: copy.filters.year,
              value: yearFilter,
              options: years.map((year) => ({
                value: year,
                label: year === "All" ? copy.filters.all : year,
                count: yearCounts[year]
              })),
              onChange: (value) => setYearFilter(value)
            }
          ]}
        />
      </div>

      {groupedEntries.length ? (
        <div className="mt-6 space-y-9">
          {groupedEntries.map(([year, items]) => (
            <section key={year} className="grid gap-2 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-6">
              <h2 className="font-mono text-xs tabular-nums tracking-[0.12em] text-muted sm:pt-6">
                {year}
              </h2>
              <div className="border-t border-line/15">
                {items.map((entry, index) => (
                  <Reveal key={entry.id} delay={Math.min(index, 5) * 40} className="border-b border-line/15">
                    <PublicationRow item={entry} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">{copy.empty}</p>
      )}

      {projects.length > 0 ? (
        <section className="mt-16">
          <Reveal>
            <SectionHeading index="02" title={copy.projectsTitle} />
          </Reveal>
          <div className="mt-4 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.name} delay={index * 60}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
