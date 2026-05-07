export type SectionNavItem<Id extends string> = {
  id: Id;
  href: string;
  i18n: string;
  fallback: string;
};

export type GetStartedSection = "mission" | "principles" | "language" | "faq";

/** Current page in the Get started section nav (includes top-level Overview). */
export type GetStartedNavCurrent = "overview" | GetStartedSection;

export const getStartedNavItems: SectionNavItem<GetStartedNavCurrent>[] = [
  { id: "overview", href: "/get-started/overview", i18n: "getStarted.toc.overview", fallback: "Overview" },
  { id: "mission", href: "/get-started/mission", i18n: "getStarted.toc.mission", fallback: "Mission" },
  {
    id: "principles",
    href: "/get-started/principles",
    i18n: "getStarted.toc.principles",
    fallback: "Design principles",
  },
  {
    id: "language",
    href: "/get-started/language",
    i18n: "getStarted.toc.language",
    fallback: "Design language",
  },
  { id: "faq", href: "/get-started/faq", i18n: "getStarted.toc.faq", fallback: "FAQs" },
];

export type FoundationsSection =
  | "colors"
  | "typography"
  | "iconography"
  | "space"
  | "size"
  | "effects"
  | "motion"
  | "gestures"
  | "haptics-sounds";

/** Current page in the foundations section nav (includes top-level Overview). */
export type FoundationsNavCurrent = "overview" | FoundationsSection;

export const foundationsNavItems: SectionNavItem<FoundationsNavCurrent>[] = [
  { id: "overview", href: "/foundations/overview", i18n: "foundations.toc.overview", fallback: "Overview" },
  { id: "colors", href: "/foundations/color", i18n: "foundations.toc.color", fallback: "Color" },
  { id: "typography", href: "/foundations/typography", i18n: "foundations.toc.typography", fallback: "Typography" },
  {
    id: "iconography",
    href: "/foundations/iconography",
    i18n: "foundations.toc.iconography",
    fallback: "Iconography",
  },
  { id: "space", href: "/foundations/space", i18n: "foundations.toc.space", fallback: "Space" },
  { id: "size", href: "/foundations/size", i18n: "foundations.toc.size", fallback: "Size" },
  { id: "effects", href: "/foundations/effects", i18n: "foundations.toc.effects", fallback: "Effects" },
  { id: "motion", href: "/foundations/motion", i18n: "foundations.toc.motion", fallback: "Motion" },
  {
    id: "gestures",
    href: "/foundations/gestures",
    i18n: "foundations.toc.gestures",
    fallback: "Gestures",
  },
  {
    id: "haptics-sounds",
    href: "/foundations/haptics-sounds",
    i18n: "foundations.toc.hapticsSounds",
    fallback: "Haptics & sounds",
  },
];

export type ComponentsSection =
  | "overview"
  | "accordion"
  | "anchor"
  | "avatars"
  | "buttons"
  | "dialog"
  | "input-fields";

/** Avatars subsection routes (under `/components/avatars/*`). */
export type AvatarsNavLeaf = "avatars-avatar" | "avatars-avatar-group";

/** Current page in the components section nav. */
export type ComponentsNavCurrent = ComponentsSection | AvatarsNavLeaf;

export type ComponentsNavChild = SectionNavItem<AvatarsNavLeaf>;

export type ComponentsNavItem =
  | (SectionNavItem<Exclude<ComponentsSection, "avatars">> & { children?: undefined })
  | (SectionNavItem<"avatars"> & { children: ComponentsNavChild[] });

export const componentsNavItems: ComponentsNavItem[] = [
  {
    id: "overview",
    href: "/components/overview",
    i18n: "components.toc.overview",
    fallback: "Overview",
  },
  { id: "accordion", href: "/components/accordion", i18n: "components.toc.accordion", fallback: "Accordion" },
  { id: "anchor", href: "/components/anchor", i18n: "components.toc.anchor", fallback: "Anchor" },
  {
    id: "avatars",
    href: "/components/avatars",
    i18n: "components.toc.avatars",
    fallback: "Avatars",
    children: [
      {
        id: "avatars-avatar",
        href: "/components/avatars/avatar",
        i18n: "components.toc.avatar",
        fallback: "Avatar",
      },
      {
        id: "avatars-avatar-group",
        href: "/components/avatars/avatar-group",
        i18n: "components.toc.avatarGroup",
        fallback: "Avatar group",
      },
    ],
  },
  { id: "buttons", href: "/components/buttons", i18n: "components.toc.buttons", fallback: "Buttons" },
  { id: "dialog", href: "/components/dialog", i18n: "components.toc.dialog", fallback: "Dialog" },
  {
    id: "input-fields",
    href: "/components/input-fields",
    i18n: "components.toc.inputFields",
    fallback: "Input fields",
  },
];

export type ResourcesSection =
  | "overview"
  | "ai-skills"
  | "figma"
  | "development"
  | "learning-videos"
  | "fonts"
  | "templates";

export type ResourcesNavCurrent = ResourcesSection;

export const resourcesNavItems: SectionNavItem<ResourcesNavCurrent>[] = [
  { id: "overview", href: "/resources/overview", i18n: "resources.toc.overview", fallback: "Overview" },
  { id: "ai-skills", href: "/resources/ai-skills", i18n: "resources.toc.aiSkills", fallback: "AI skills" },
  { id: "figma", href: "/resources/figma", i18n: "resources.toc.figma", fallback: "Figma" },
  {
    id: "development",
    href: "/resources/development",
    i18n: "resources.toc.development",
    fallback: "Development",
  },
  {
    id: "learning-videos",
    href: "/resources/learning-videos",
    i18n: "resources.toc.learningVideos",
    fallback: "Learning videos",
  },
  { id: "fonts", href: "/resources/fonts", i18n: "resources.toc.fonts", fallback: "Fonts" },
  {
    id: "templates",
    href: "/resources/templates",
    i18n: "resources.toc.templates",
    fallback: "Templates",
  },
];

export type ArticleNavCurrent = "featured" | "latest" | "y2026" | "y2025";

export const articleNavItems: SectionNavItem<ArticleNavCurrent>[] = [
  { id: "featured", href: "/articles/featured", i18n: "article.nav.featured", fallback: "Featured" },
  { id: "latest", href: "/articles/latest", i18n: "article.nav.latest", fallback: "Latest updates" },
  { id: "y2026", href: "/articles/2026", i18n: "article.nav.y2026", fallback: "2026" },
  { id: "y2025", href: "/articles/2025", i18n: "article.nav.y2025", fallback: "2025" },
];
