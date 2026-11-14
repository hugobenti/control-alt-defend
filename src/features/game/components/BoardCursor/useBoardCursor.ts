import { game } from "@/content/game";

import { cellOrigin } from "../../logic/geometry";
import type { IBoardCursorProps } from "./BoardCursor.type";

export function useBoardCursor({ c, r }: IBoardCursorProps) {
  const x = cellOrigin(c) + 1;
  const y = cellOrigin(r) + 1;
  return {
    x,
    y,
    label: game.cursor(c, r),
    ticks: `M${x} ${y + 6} V${y} H${x + 6} M${x + 32} ${y} H${x + 38} V${y + 6} M${x + 38} ${y + 32} V${y + 38} H${x + 32} M${x + 6} ${y + 38} H${x} V${y + 32}`,
  };
}
