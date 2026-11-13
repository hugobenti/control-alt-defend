import { site } from "@/content/site";

import { ogCard } from "./OgCard.style";

/** The social share image, rendered by Satori (next/og) in src/app/opengraph-image.ts. */
export function OgCard() {
  return (
    <div style={ogCard.base}>
      <div style={ogCard.mark}>{site.monogram}</div>
      <div style={ogCard.title}>{site.name}</div>
      <div style={ogCard.description}>{site.description}</div>
    </div>
  );
}
