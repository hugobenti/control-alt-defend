import { game } from "@/content/game";

import { CELL, cellOrigin } from "../../logic/geometry";
import type { IPortProps } from "./Port.type";

export function usePort({ port, cols, rows }: IPortProps, keepoutId?: string) {
  const horizontal = port.side === "top" || port.side === "bottom";
  const far = port.side === "right" || port.side === "bottom";
  const edge = horizontal ? cellOrigin(rows) : cellOrigin(cols);
  const start = cellOrigin(port.start);
  const offset = far ? edge : 0;
  return {
    hatchFill: keepoutId ? `url(#${keepoutId})` : undefined,
    gap: horizontal
      ? { x: start, y: far ? offset : -16, width: 80, height: 16 }
      : { x: far ? offset : -16, y: start, width: 16, height: 80 },
    hatch: horizontal
      ? { x: start, y: far ? offset - CELL : 0, width: 80, height: CELL }
      : { x: far ? offset - CELL : 0, y: start, width: CELL, height: 80 },
    outline: horizontal
      ? { x: start + 0.5, y: (far ? offset - CELL : 0) + 0.5, width: 79, height: 39 }
      : { x: (far ? offset - CELL : 0) + 0.5, y: start + 0.5, width: 39, height: 79 },
    fingers: Array.from({ length: 7 }, (_, i) =>
      horizontal
        ? { x: start + 6 + i * 10.3, y: (far ? offset : -16) + 3, width: 6, height: 10 }
        : { x: (far ? offset : -16) + 3, y: start + 6 + i * 10.3, width: 10, height: 6 },
    ),
    label: horizontal
      ? { x: start + 4, y: far ? offset - 46 : 52, anchor: "start" as const }
      : {
          x: far ? offset - 46 : 4,
          y: start - 8,
          anchor: far ? ("end" as const) : ("start" as const),
        },
    text: game.port(port.id),
  };
}
