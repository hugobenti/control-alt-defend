import type { ILevelMap, IPort } from "../level/level.type";
import { CELL, cellOrigin } from "./geometry";
import type { ICell, IGrid, IPoint } from "./grid.type";

export function cellIndex(grid: IGrid, cell: ICell): number {
  return cell.r * grid.cols + cell.c;
}

export function inBounds(grid: IGrid, cell: ICell): boolean {
  return cell.c >= 0 && cell.c < grid.cols && cell.r >= 0 && cell.r < grid.rows;
}

export function cellOf(p: IPoint): ICell {
  return { c: Math.floor(p.x / CELL), r: Math.floor(p.y / CELL) };
}

export function portCells(map: ILevelMap, port: IPort): [ICell, ICell] {
  switch (port.side) {
    case "left":
      return [
        { c: 0, r: port.start },
        { c: 0, r: port.start + 1 },
      ];
    case "right":
      return [
        { c: map.cols - 1, r: port.start },
        { c: map.cols - 1, r: port.start + 1 },
      ];
    case "top":
      return [
        { c: port.start, r: 0 },
        { c: port.start + 1, r: 0 },
      ];
    case "bottom":
      return [
        { c: port.start, r: map.rows - 1 },
        { c: port.start + 1, r: map.rows - 1 },
      ];
  }
}

export function portInsideCells(map: ILevelMap, port: IPort): [ICell, ICell] {
  const [first, second] = portCells(map, port);
  const dc = port.side === "left" ? 1 : port.side === "right" ? -1 : 0;
  const dr = port.side === "top" ? 1 : port.side === "bottom" ? -1 : 0;
  return [
    { c: first.c + dc, r: first.r + dr },
    { c: second.c + dc, r: second.r + dr },
  ];
}

export function coreCells(map: ILevelMap): ICell[] {
  const { c, r } = map.core;
  return [
    { c, r },
    { c: c + 1, r },
    { c, r: r + 1 },
    { c: c + 1, r: r + 1 },
  ];
}

export function coreRect(map: ILevelMap): { x: number; y: number; w: number; h: number } {
  return { x: cellOrigin(map.core.c), y: cellOrigin(map.core.r), w: CELL * 2, h: CELL * 2 };
}

export function buildStaticGrid(map: ILevelMap): IGrid {
  const size = map.cols * map.rows;
  const grid: IGrid = {
    cols: map.cols,
    rows: map.rows,
    blocked: new Uint8Array(size),
    keepOut: new Uint8Array(size),
    core: new Uint8Array(size),
  };
  for (const obstacle of map.obstacles) {
    for (let r = obstacle.r; r < obstacle.r + obstacle.h; r++) {
      for (let c = obstacle.c; c < obstacle.c + obstacle.w; c++) {
        const index = cellIndex(grid, { c, r });
        grid.blocked[index] = 1;
        grid.keepOut[index] = 1;
      }
    }
  }
  for (const cell of coreCells(map)) {
    const index = cellIndex(grid, cell);
    grid.blocked[index] = 1;
    grid.keepOut[index] = 1;
    grid.core[index] = 1;
  }
  for (const port of map.ports) {
    for (const cell of [...portCells(map, port), ...portInsideCells(map, port)]) {
      grid.keepOut[cellIndex(grid, cell)] = 1;
    }
  }
  return grid;
}

export function withBlocked(grid: IGrid, cells: ICell[]): IGrid {
  const blocked = grid.blocked.slice();
  for (const cell of cells) blocked[cellIndex(grid, cell)] = 1;
  return { ...grid, blocked };
}

export function withoutBlocked(grid: IGrid, cells: ICell[]): IGrid {
  const blocked = grid.blocked.slice();
  for (const cell of cells) blocked[cellIndex(grid, cell)] = 0;
  return { ...grid, blocked };
}

export function discTouchesRect(
  p: IPoint,
  radius: number,
  rect: { x: number; y: number; w: number; h: number },
): boolean {
  const dx = p.x - Math.max(rect.x, Math.min(p.x, rect.x + rect.w));
  const dy = p.y - Math.max(rect.y, Math.min(p.y, rect.y + rect.h));
  return dx * dx + dy * dy <= radius * radius;
}

export function discOverlapsCell(p: IPoint, radius: number, cell: ICell): boolean {
  return discTouchesRect(p, radius, {
    x: cellOrigin(cell.c),
    y: cellOrigin(cell.r),
    w: CELL,
    h: CELL,
  });
}
