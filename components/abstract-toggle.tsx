"use client";

import { useId, useState } from "react";

type AbstractToggleProps = {
  text: string;
  labels: { open: string; close: string };
};

/** Quiet expandable abstract; the row height animates via grid rows. */
export function AbstractToggle({ text, labels }: AbstractToggleProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-brand-text"
      >
        <span className="link-underline">{open ? labels.close : labels.open}</span>
        <span aria-hidden="true" className="text-[0.9em]">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        id={id}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[68ch] pt-2 text-sm leading-relaxed text-muted">{text}</p>
        </div>
      </div>
    </div>
  );
}
