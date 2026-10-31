import type { ReactNode } from "react";

type SectionHeadingProps = {
  index: string;
  title: string;
  action?: ReactNode;
};

export function SectionHeading({ index, title, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line/15 pt-5">
      <h2 className="section-title">
        <span className="section-index">{index}</span>
        {title}
      </h2>
      {action ? <div className="text-sm">{action}</div> : null}
    </div>
  );
}
