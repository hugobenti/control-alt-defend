import type { ILevelMap } from "../level/level.type";
import type { ICell } from "./grid.type";

export const CELL = 40;

export function cellOrigin(c: number): number {
  return c * CELL;
}

export function cellCenter(c: number): number {
  return cellOrigin(c) + CELL / 2;
}

export function boardSize(cols: number, rows: number): { width: number; height: number } {
  return { width: cellOrigin(cols), height: cellOrigin(rows) };
}
export function isVoidCell(cell: ICell, map: ILevelMap): boolean {
  return map.voids.some(
    (area) =>
      cell.c >= area.c && cell.c < area.c + area.w && cell.r >= area.r && cell.r < area.r + area.h,
  );
}

export function moveBoardCursor(cell: ICell, dc: number, dr: number, map: ILevelMap): ICell {
  const next = { c: cell.c + dc, r: cell.r + dr };
  return next.c < 0 ||
    next.c >= map.cols ||
    next.r < 0 ||
    next.r >= map.rows ||
    isVoidCell(next, map)
    ? cell
    : next;
}

export function pointToCell(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  map: ILevelMap,
): ICell | null {
  if (rect.width <= 0 || rect.height <= 0) return null;
  const viewWidth = map.cols * CELL + 32;
  const viewHeight = map.rows * CELL + 32;
  const scale = Math.min(rect.width / viewWidth, rect.height / viewHeight);
  const x = (clientX - rect.left - (rect.width - viewWidth * scale) / 2) / scale - 16;
  const y = (clientY - rect.top - (rect.height - viewHeight * scale) / 2) / scale - 16;
  if (x < 0 || y < 0 || x >= map.cols * CELL || y >= map.rows * CELL) return null;
  const cell = { c: Math.floor(x / CELL), r: Math.floor(y / CELL) };
  return isVoidCell(cell, map) ? null : cell;
}
