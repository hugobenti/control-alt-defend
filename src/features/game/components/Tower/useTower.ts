import { game } from "@/content/game";

import { cellCenter } from "../../logic/geometry";
import type { ITowerProps } from "./Tower.type";

export function useTower({ type, version, c, r, aimAt, selected, boosted }: ITowerProps) {
  const x = cellCenter(c);
  const y = cellCenter(r);
  const rotation = aimAt ? (Math.atan2(aimAt.y - y, aimAt.x - x) * 180) / Math.PI + 90 : 0;
  return {
    transform: `translate(${x},${y})`,
    rotation,
    barrelTransform: `rotate(${rotation})`,
    pips: [0, 1, 2].map((index) => ({ x: -9.5 + index * 7, active: index < version })),
    label: game.tower(type, version, Boolean(boosted), Boolean(selected)),
  };
}
