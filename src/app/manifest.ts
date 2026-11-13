import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { ICON_SIZES } from "@/features/shared/brand/brandImage";
import { themeColor } from "@/features/shared/theme/themeTokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: themeColor("light", "bg"),
    theme_color: themeColor("light", "bg"),
    icons: ICON_SIZES.map((size) => ({
      src: `/icon/${size}`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
  };
}
