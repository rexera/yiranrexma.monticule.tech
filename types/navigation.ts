export type NavItem = {
  label: string;
  href: string;
  /** Opens in a new tab as a plain anchor instead of client-side routing
   *  (used for standalone pages like the CV at /cv.html). */
  external?: boolean;
};
