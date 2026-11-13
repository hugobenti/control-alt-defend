import { ImageResponse } from "next/og";
import { createElement } from "react";

import { BrandMark } from "@/features/shared/brand/BrandMark";
import { brandMarkStyle, ICON_SIZES } from "@/features/shared/brand/brandImage";

export const contentType = "image/png";

/** Favicon and PWA icons, served as `/icon/{size}`. */
export function generateImageMetadata() {
  return ICON_SIZES.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType,
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id);
  return new ImageResponse(createElement(BrandMark, { style: brandMarkStyle(size) }), {
    width: size,
    height: size,
  });
}
