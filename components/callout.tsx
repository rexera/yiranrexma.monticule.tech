type CalloutProps = {
  title?: string;
  children: React.ReactNode;
};

/**
 * Highlighted note: an olive margin rule, no card, so it reads as a
 * marginal remark rather than a box inside the text.
 */
export function Callout({ title, children }: CalloutProps) {
  return (
    <div className="space-y-1.5 border-l-2 border-brand/50 py-0.5 pl-4 text-sm leading-relaxed text-ink/80">
      {title ? (
        <p className="font-semibold text-brand-text">{title}</p>
      ) : null}
      <div>{children}</div>
    </div>
  );
}
