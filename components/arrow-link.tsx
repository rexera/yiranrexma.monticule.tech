import Link from "next/link";
import type { ReactNode } from "react";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
};

export function ArrowLink({ href, children }: ArrowLinkProps) {
  return (
    <Link
      href={href as any}
      className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-brand-text"
    >
      <span className="link-underline">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
