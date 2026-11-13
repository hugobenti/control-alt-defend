import { ImageResponse } from "next/og";
import { createElement } from "react";

import { site } from "@/content/site";
import { OgCard } from "@/features/shared/brand/OgCard";
import { OG_IMAGE_SIZE } from "@/features/shared/brand/brandImage";

export const alt = site.name;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(createElement(OgCard), size);
}
