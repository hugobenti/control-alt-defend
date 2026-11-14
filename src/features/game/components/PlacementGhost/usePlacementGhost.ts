import { useId } from "react";

import { game } from "@/content/game";

import { cellOrigin } from "../../logic/geometry";
import type { IPlacementGhostProps } from "./PlacementGhost.type";

export function usePlacementGhost(
  { c, r, valid, reason }: IPlacementGhostProps,
  invalidId?: string,
) {
  const x = cellOrigin(c);
  const y = cellOrigin(r);
  const reasonId = useId();
  return {
    label: valid ? game.placement.valid : game.placement.invalid,
    reasonId: valid || !reason ? undefined : reasonId,
    tile: { x: x + 1, y: y + 1 },
    badgeTransform: `translate(${x + 38},${y + 2})`,
    blockTransform: `translate(${x + 8},${y + 8})`,
    tooltipTransform: `translate(${x + 52},${y + 70})`,
    invalidFill: invalidId ? `url(#${invalidId})` : undefined,
  };
}
