export type LocaleProfile = {
  name: string;
  nativeName?: string;
  aka?: string;
  title: string;
  affiliation: string;
  location: string;
  keywords: string[];
  social: {
    label: string;
    href: string;
    /** Optional QR-code image under /public; shown in a hover popover instead of linking out. */
    qr?: string;
  }[];
  avatar?: string;
};

export type Localized<T> = {
  en: T;
  zh: T;
};

export type ProfileContent = Localized<LocaleProfile>;

export type PublicationEntry = {
  id: string;
  type: "C" | "J" | "P" | "S";
  slug?: string;
  featured?: boolean;
  title: string;
  authors: string;
  venue: string;
  year: string;
  tags?: string[];
  links?: {
    label: string;
    href: string;
  }[];
  notes?: string;
};

export type ProjectEntry = {
  name: string;
  summary: string;
  period: string;
  role: string;
  tags?: string[];
  links?: {
    label: string;
    href: string;
  }[];
  metrics?: Record<string, string | number>;
};

export type ProjectGroup = {
  title: string;
  kind: "academic" | "open-source" | string;
  items: ProjectEntry[];
};

export type UpdateEntry = {
  date: string;
  type: string;
  title: string;
  summary: string;
  link: string;
};

export type ProjectsContent = Localized<{
  groups: ProjectGroup[];
}>;

export type PublicationsContent = Localized<{
  entries: PublicationEntry[];
}>;

export type UpdatesContent = Localized<{
  updates: UpdateEntry[];
}>;

export type BlogPageCopy = Localized<{
  title: string;
  eyebrow: string;
  description: string;
  filters: {
    type: string;
    year: string;
    all: string;
  };
  types: {
    research: string;
    note: string;
  };
  empty: string;
}>;

export type HomePageCopy = Localized<{
  /** Short lead lines under the name — one statement each, no links. */
  leads: string[];
  email: string;
  sections: {
    work: string;
    news: string;
    writing: string;
    all: string;
  };
}>;

export type PublicationsPageCopy = Localized<{
  title: string;
  eyebrow: string;
  description: string;
  publicationsTitle: string;
  filters: {
    type: string;
    year: string;
    all: string;
  };
  types: {
    C: string;
    J: string;
    P: string;
    S: string;
  };
  empty: string;
  projectsTitle: string;
}>;

export type StoryPageCopy = Localized<{
  story: { title: string };
  experience: { title: string };
  education: { title: string };
}>;
