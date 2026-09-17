export type NavItem = {
  label: string;
  href: string;
  /** Opens in a new tab as a plain anchor instead of client-side routing
   *  (for standalone pages served from /public that live outside the
   *  locale route tree). */
  external?: boolean;
};
