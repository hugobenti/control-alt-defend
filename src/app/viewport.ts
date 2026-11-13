import type { Viewport } from "next";

import { themeColor } from "@/features/shared/theme/themeTokens";

/** Browser chrome color (`theme-color`), the `bg` token. */
export const siteViewport: Viewport = {
  themeColor: themeColor("bg"),
};
