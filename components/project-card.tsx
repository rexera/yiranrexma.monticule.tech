import { ExternalLinkIcon, StarIcon } from "@/components/icons";
import type { ProjectEntry } from "@/lib/content-types";

type ProjectCardProps = {
  project: ProjectEntry;
};

/**
 * Project as an editorial entry: a hairline, a title line with its period,
 * then summary, tags, and links. No surface, no lift.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const otherMetrics = project.metrics
    ? Object.entries(project.metrics).filter(([key]) => key !== "stars")
    : [];

  return (
    <article className="border-t border-line/10 pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[1.05rem] font-semibold text-ink">{project.name}</h3>
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted">{project.period}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
      {project.tags?.length ? (
        <p className="mt-3 text-xs text-muted">{project.tags.join(" · ")}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {typeof project.metrics?.stars === "number" && project.metrics.stars > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <StarIcon aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="tabular-nums">{project.metrics.stars}</span>
          </span>
        ) : null}
        {otherMetrics.length ? (
          <span className="text-xs text-muted">
            {otherMetrics.map(([key, value]) => `${key}: ${value}`).join(" · ")}
          </span>
        ) : null}
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {(project.links ?? []).map((link) => {
            const isExternal = link.href.startsWith("http") || link.href.startsWith("//");
            return (
              <a
                key={link.label}
                href={link.href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="link-underline inline-flex items-center gap-1 text-muted transition-colors hover:text-brand-text"
              >
                {link.label}
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            );
          })}
        </span>
      </div>
    </article>
  );
}
