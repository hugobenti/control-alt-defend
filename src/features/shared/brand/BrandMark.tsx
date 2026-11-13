import { site } from "@/content/site";

import type { IBrandMarkProps } from "./BrandMark.type";

/** The monogram tile, rendered by Satori (next/og) into the app icons; styled inline for that reason. */
export function BrandMark({ style }: IBrandMarkProps) {
  return <div style={style}>{site.monogram}</div>;
}
