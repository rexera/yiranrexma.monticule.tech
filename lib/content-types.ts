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
  cvLink: string;
  avatar?: string;
};

export type Localized<T> = {
  en: T;
  zh: T;
};

export type ProfileContent = Localized<LocaleProfile>;

export type ResearchInterest = {
  title: string;
  description: string;
};

export type ResearchExperience = {
  title: string;
  period: string;
  role: string;
  advisor?: string;
  funding?: string;
  summary: string;
  bullets: string[];
  tags?: string[];
};

export type PublicationEntry = {
  id: string;
  type: "C" | "J" | "P" | "S";
  slug?: string;
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

export type TimelineEntry = {
  title: string;
  period: string;
  location?: string;
  details: string[];
};

export type AwardEntry = {
  title: string;
  issuer: string;
  year: string;
  notes?: string;
};

export type UpdateEntry = {
  date: string;
  type: string;
  title: string;
  summary: string;
  link: string;
};

export type ResearchContent = Localized<{
  interests: ResearchInterest[];
  experiences: ResearchExperience[];
}>;

export type ProjectsContent = Localized<{
  groups: ProjectGroup[];
}>;

export type TimelineContent = Localized<{
  education: TimelineEntry[];
  experience: TimelineEntry[];
}>;

export type PublicationsContent = Localized<{
  entries: PublicationEntry[];
}>;

export type AwardsContent = Localized<{
  awards: AwardEntry[];
}>;

export type UpdatesContent = Localized<{
  updates: UpdateEntry[];
}>;

export type BlogPageCopy = Localized<{
  title: string;
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
  heroIntro: string;
  buttons: {
    cv: string;
    publications: string;
    blog: string;
  };
  highlights: {
    title: string;
    focusLabel: string;
    focusValue: string;
    contactLabel: string;
    contactValue: string;
    locationLabel: string;
  };
  timeline: { title: string };
  commits: { title: string };
}>;

export type PublicationsPageCopy = Localized<{
  title: string;
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

export type CVPageCopy = Localized<{
  intro: {
    title: string;
    emailLabel: string;
  };
  education: { title: string };
  experience: { title: string };
  publications: { title: string };
  honors: {
    title: string;
    headers: string[];
  };
  skills: {
    title: string;
    headers: string[];
    rows: string[][];
  };
}>;

export type ExperiencePageCopy = Localized<{
  story: { title: string };
  experience: { title: string };
  education: { title: string };
}>;
