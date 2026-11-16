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
  return { c: Math.floor(x / CELL), r: Math.floor(y / CELL) };
}
