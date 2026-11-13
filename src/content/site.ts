import { env } from "@/env";

import type { ISiteContent } from "./content.type";

export const site: ISiteContent = {
  name: "Ctrl+Alt+Defend",
  description:
    "Tower defense game in the browser: build security programs into a maze and stop viruses from stealing your data.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "Hugo Bentivegna",
  lang: "en",
  monogram: "C",
};
