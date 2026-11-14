import { CELL, cellCenter } from "../../logic/geometry";
import type { IRangeRingProps } from "./RangeRing.type";

export function useRangeRing({ c, r, range }: IRangeRingProps) {
  return { cx: cellCenter(c), cy: cellCenter(r), radius: range * CELL };
}
