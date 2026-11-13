import type { MetadataRoute } from "next";

import { site } from "@/content/site";

// Every public route. The e2e suite (e2e/smoke.spec.ts) loads each one and runs axe on it.
const PUBLIC_PATHS = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({ url: `${site.url}${path}` }));
}
