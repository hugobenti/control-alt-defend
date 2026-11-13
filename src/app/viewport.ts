import type { Viewport } from "next";

import { themeColor } from "@/features/shared/theme/themeTokens";

/** Browser chrome color (`theme-color`) matching each scheme's `bg` token. */
export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColor("light", "bg") },
    { media: "(prefers-color-scheme: dark)", color: themeColor("dark", "bg") },
  ],
};
