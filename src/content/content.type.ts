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
