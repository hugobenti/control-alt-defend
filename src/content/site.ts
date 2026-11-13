import { env } from "@/env";

import type { ISiteContent } from "./content.type";

export const site: ISiteContent = {
  name: "Next.js Template",
  description:
    "Next.js starter with strict TypeScript, token-based Tailwind, accessibility and AI agent rules built in",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "Hugo Bentivegna",
  lang: "en",
  monogram: "N",
};
