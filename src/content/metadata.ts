import type { Metadata } from "next";

import { site } from "./site";
import { statusPages } from "./statusPages";

/**
 * Page metadata, derived from the site content. `metadataBase` makes every relative URL (canonical,
 * social image) absolute.
 */
export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.author }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

export const homeMetadata: Metadata = {
  alternates: { canonical: "/" },
};

export const notFoundMetadata: Metadata = {
  title: statusPages.notFound.metaTitle,
  robots: { index: false },
};
