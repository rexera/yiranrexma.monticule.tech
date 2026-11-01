import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  note?: string;
  action?: ReactNode;
};

export function SectionHeading({ title, note, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line/10 pt-6">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="section-title">{title}</h2>
        {note ? <span className="section-note">{note}</span> : null}
      </div>
      {action ? <div className="text-sm">{action}</div> : null}
    </div>
  );
}
