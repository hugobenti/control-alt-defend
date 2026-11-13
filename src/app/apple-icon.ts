import { ImageResponse } from "next/og";
import { createElement } from "react";

import { BrandMark } from "@/features/shared/brand/BrandMark";
import { APPLE_ICON_SIZE, brandMarkStyle } from "@/features/shared/brand/brandImage";

export const size = { width: APPLE_ICON_SIZE, height: APPLE_ICON_SIZE };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    createElement(BrandMark, { style: brandMarkStyle(APPLE_ICON_SIZE, { square: true }) }),
    size,
  );
}
