/** Site-wide identity, used by metadata, the manifest, robots, the sitemap and generated images. */
export interface ISiteContent {
  name: string;
  description: string;
  /** Production origin, no trailing slash. */
  url: string;
  author: string;
  /** `<html lang>`. */
  lang: string;
  /** The letter drawn on the generated app icons and social image. */
  monogram: string;
}

/** Copy for the home page. */
export interface IHomeContent {
  h1: string;
  lead: string;
}

/** Copy for the 404 page. */
export interface IStatusPagesContent {
  notFound: { metaTitle: string; h1: string; text: string; home: string };
}

/** Board labels and the names of rendered game pieces. */
export interface IGameContent {
  board: string;
  coreLabel: string;
  core: (filesInCore: number, files: number) => string;
  port: (label: string) => string;
  obstacle: Record<"chip" | "capacitor" | "resistor" | "crystal", string>;
  file: Record<"inCore" | "dropped", string>;
}
