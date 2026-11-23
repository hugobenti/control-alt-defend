import { useMemo } from "react";

import { game } from "@/content/game";

import { boardOutline } from "../../logic/boardOutline";
import { boardSize, cellOrigin } from "../../logic/geometry";
import type { IBoardProps } from "./Board.type";

export function useBoard(map: IBoardProps["map"], dotsId: string, files = 8, filesInCore = files) {
  const { width, height } = boardSize(map.cols, map.rows);
  const outline = useMemo(() => boardOutline(map), [map]);
  return {
    viewBox: `-16 -16 ${width + 32} ${height + 32}`,
    outline,
    clipId: `${dotsId}-surface`,
    clipFill: `url(#${dotsId}-surface)`,
    dotsFill: `url(#${dotsId})`,
    width,
    height,
    core: { x: cellOrigin(map.core.c + 1), y: cellOrigin(map.core.r + 1) },
    files,
    filesInCore,
    label: game.board,
  };
}
