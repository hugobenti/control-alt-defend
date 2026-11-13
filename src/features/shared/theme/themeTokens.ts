/**
 * Color tokens read from src/app/globals.css (the single token source) for server-rendered output
 * that can't use CSS variables: browser chrome color, web manifest, generated icons and social images.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { readDarkColors, readThemeColors } from "@/features/shared/utils/colorContrast";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const light = readThemeColors(css);
const schemes = { light, dark: { ...light, ...readDarkColors(css) } };

/** The value of `--color-<name>` in the given scheme. */
export function themeColor(scheme: keyof typeof schemes, name: string): string {
  const value = schemes[scheme][name];
  if (!value) {
    // eslint-disable-next-line no-restricted-syntax -- developer error at build time, never shown to users
    throw new Error(`Missing color token --color-${name} in src/app/globals.css`);
  }
  return value;
}
