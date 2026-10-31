import clsx from "clsx";

type FilterOption = {
  label: string;
  value: string;
  count?: number;
};

type FilterGroup = {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

type FilterToolbarProps = {
  groups: FilterGroup[];
  className?: string;
};

/**
 * Text-only filter rail. The active option keeps a hairline underneath and
 * every option carries its count, so the reader can see the shape of the
 * archive before clicking.
 */
export function FilterToolbar({ groups, className }: FilterToolbarProps) {
  if (!groups.length) return null;

  return (
    <div
      className={clsx(
        "flex flex-col gap-2 border-t border-line/15 py-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10",
        className
      )}
    >
      {groups.map((group) => (
        <div key={group.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="eyebrow shrink-0">{group.label}</span>
          {group.options.map((option) => {
            const active = option.value === group.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => group.onChange(option.value)}
                className={clsx(
                  "relative pb-0.5 transition-colors",
                  active ? "text-brand-text" : "text-muted hover:text-ink"
                )}
              >
                {option.label}
                {typeof option.count === "number" ? (
                  <span className="ml-1.5 font-mono text-[0.625rem] tabular-nums text-muted">
                    {option.count}
                  </span>
                ) : null}
                {active ? (
                  <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-px bg-brand-text" />
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
