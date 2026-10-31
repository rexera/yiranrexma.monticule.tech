import type { ReactNode } from "react";

/** Remounts on navigation, which gives each page a short fade-and-rise. */
export default function LocaleTemplate({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
