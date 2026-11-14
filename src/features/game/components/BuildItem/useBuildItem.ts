import { useId } from "react";

import { game } from "@/content/game";

import type { IBuildItemProps } from "./BuildItem.type";

export function useBuildItem({ type, cost, state, missingBits = 0 }: IBuildItemProps) {
  const id = useId();
  const subtitleId = `${id}-subtitle`;
  const costId = `${id}-cost`;
  const locked = state === "locked";
  const subtitles = {
    available: game.towerRoles[type],
    placing: game.build.placingHint,
    poor: game.build.needBits(missingBits),
    locked: game.build.lockedReason,
  };
  return {
    subtitleId,
    costId,
    name: game.towerNames[type],
    subtitle: subtitles[state],
    isReason: state === "poor" || locked,
    disabled: state === "poor" || locked,
    pressed: state === "placing",
    showLock: locked,
    showCost: !locked,
    costValue: state === "poor" ? ("poor" as const) : ("available" as const),
    costText: game.build.cost(cost),
    describedBy: locked ? subtitleId : `${subtitleId} ${costId}`,
  };
}
