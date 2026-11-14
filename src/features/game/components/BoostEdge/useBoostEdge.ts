import { cellCenter } from "../../logic/geometry";
import type { IBoostEdgeProps } from "./BoostEdge.type";

export function useBoostEdge({ from, to }: IBoostEdgeProps) {
  const dc = Math.abs(to.c - from.c);
  const dr = Math.abs(to.r - from.r);
  if (dc + dr !== 1) return null;
  const x = (cellCenter(from.c) + cellCenter(to.c)) / 2;
  const y = (cellCenter(from.r) + cellCenter(to.r)) / 2;
  return dc ? { x1: x, y1: y - 10, x2: x, y2: y + 10 } : { x1: x - 10, y1: y, x2: x + 10, y2: y };
}

export function useBoostEdgeGlow(glowId?: string) {
  return glowId ? `url(#${glowId})` : undefined;
}
