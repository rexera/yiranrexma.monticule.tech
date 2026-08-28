import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Layout wrapper for page sections. A single flat heading — no eyebrow
 * labels, no description paragraphs.
 */
export function Section({ title, actions, children }: SectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <h2 className="flex-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{title}</h2>
        {actions ? <div className="flex items-center gap-2 text-sm sm:ml-auto">{actions}</div> : null}
      </div>
      <span className="block h-px w-16 bg-gradient-to-r from-brand/50 to-transparent" aria-hidden="true" />
      <div className="space-y-8">{children}</div>
    </section>
  );
}
