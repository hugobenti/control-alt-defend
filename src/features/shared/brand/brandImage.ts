import type { CSSProperties } from "react";

import { themeColor } from "@/features/shared/theme/themeTokens";

/** Generated favicon and PWA icon sizes (src/app/icon.ts, src/app/manifest.ts). */
export const ICON_SIZES = [32, 192, 512];
export const APPLE_ICON_SIZE = 180;
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * The monogram tile at `size` pixels. iOS rounds the apple icon itself, so it asks for a square tile.
 */
export function brandMarkStyle(size: number, { square = false } = {}): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    background: themeColor("accent"),
    color: themeColor("on-accent"),
    fontSize: Math.round(size * 0.62),
    fontWeight: 700,
    borderRadius: square ? 0 : Math.round(size * 0.2),
  };
}
