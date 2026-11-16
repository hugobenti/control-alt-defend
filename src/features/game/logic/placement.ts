import type { ILevelMap } from "../level/level.type";
import { balance } from "./balance.data";
import { computeDistanceField, pathCells } from "./distanceField";
import { cellCenter } from "./geometry";
import {
  cellIndex,
  cellOf,
  coreCells,
  discOverlapsCell,
  portCells,
  portInsideCells,
  withBlocked,
} from "./grid";
import type { ICell, IGrid, IPoint } from "./grid.type";
import type { IPlacementInput, TPlacementRefusal } from "./placement.type";

/** A piece occupying the proposed cell is in the way, not trapped; overlap takes precedence for it. */
export function checkPlacement(input: IPlacementInput): TPlacementRefusal | null {
  const { map, grid, cell, enemies, droppedFiles, bits, cost } = input;
  const index = cellIndex(grid, cell);
  if (grid.keepOut[index]) return "keepOut";
  if (grid.blocked[index]) return "occupied";
  const field = computeDistanceField(withBlocked(grid, [cell]), coreCells(map));
  for (const port of map.ports) {
    for (const entry of portCells(map, port)) {
      if (field[cellIndex(grid, entry)] === Infinity) return "blocksRoute";
    }
  }
  for (const enemy of enemies) {
    const enemyIndex = cellIndex(grid, cellOf(enemy.pos));
    if (enemyIndex !== index && field[enemyIndex] === Infinity) return "trapsPiece";
  }
  for (const file of droppedFiles) {
    const fileIndex = cellIndex(grid, cellOf(file));
    if (fileIndex !== index && field[fileIndex] === Infinity) return "trapsPiece";
  }
  for (const enemy of enemies) {
    if (discOverlapsCell(enemy.pos, enemy.radius, cell)) return "overlapsEnemy";
  }
  for (const file of droppedFiles) {
    if (discOverlapsCell(file, balance.files.radius, cell)) return "overlapsFile";
  }
  if (bits < cost) return "notEnoughBits";
  return null;
}

export function routePreview(map: ILevelMap, grid: IGrid, cell: ICell | null): IPoint[][] {
  const preview = cell === null ? grid : withBlocked(grid, [cell]);
  const field = computeDistanceField(preview, coreCells(map));
  return map.ports.map((port) => {
    const start = portInsideCells(map, port)[0];
    if (field[cellIndex(preview, start)] === Infinity) return [];
    const cells = pathCells(field, preview, start, grid.cols * grid.rows);
    if (!cells.length || field[cellIndex(preview, cells[cells.length - 1]!)] !== 0) return [];
    return [start, ...cells].map((point) => ({ x: cellCenter(point.c), y: cellCenter(point.r) }));
  });
}
