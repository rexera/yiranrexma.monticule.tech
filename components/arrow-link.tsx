import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowRightIcon } from "@/components/icons";

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
      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
