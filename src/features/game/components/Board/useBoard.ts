import { game } from "@/content/game";

import { boardSize, cellOrigin } from "../../logic/geometry";
import type { IBoardProps } from "./Board.type";

export function useBoard(map: IBoardProps["map"], dotsId: string, files = 8, filesInCore = files) {
  const { width, height } = boardSize(map.cols, map.rows);
  return {
    viewBox: `-16 -16 ${width + 32} ${height + 32}`,
    frame: { x: -16, y: -16, width: width + 32, height: height + 32 },
    dotsFill: `url(#${dotsId})`,
    width,
    height,
    core: { x: cellOrigin(map.core.c + 1), y: cellOrigin(map.core.r + 1) },
    files,
    filesInCore,
    label: game.board,
  };
}
