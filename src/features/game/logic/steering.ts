import { balance } from "./balance.data";
import { pathCells } from "./distanceField";
import { CELL, cellCenter, cellOrigin } from "./geometry";
import { cellOf, cellIndex, discOverlapsCell } from "./grid";
import type { IGrid, IPoint } from "./grid.type";

export function hasLineOfSight(
  grid: IGrid,
  from: IPoint,
  to: IPoint,
  radius: number,
  allow: Uint8Array | null,
): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const samples = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (radius / 2 || 1)));
  for (let i = 0; i <= samples; i++) {
    const point = { x: from.x + (dx * i) / samples, y: from.y + (dy * i) / samples };
    if (
      point.x - radius < 0 ||
      point.y - radius < 0 ||
      point.x + radius > cellOrigin(grid.cols) ||
      point.y + radius > cellOrigin(grid.rows)
    )
      return false;
    const minC = Math.max(0, Math.floor((point.x - radius) / CELL));
    const maxC = Math.min(grid.cols - 1, Math.floor((point.x + radius) / CELL));
    const minR = Math.max(0, Math.floor((point.y - radius) / CELL));
    const maxR = Math.min(grid.rows - 1, Math.floor((point.y + radius) / CELL));
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const cell = { c, r };
        const index = cellIndex(grid, cell);
        if (grid.blocked[index] && !allow?.[index] && discOverlapsCell(point, radius, cell))
          return false;
      }
    }
  }
  return true;
}

export function nextWaypoint(
  grid: IGrid,
  field: Float64Array,
  pos: IPoint,
  radius: number,
  offset: IPoint,
  allow: Uint8Array | null,
): IPoint | null {
  const path = pathCells(field, grid, cellOf(pos), balance.movement.lookaheadCells);
  if (path.length === 0) return null;
  for (let i = path.length - 1; i >= 0; i--) {
    const cell = path[i]!;
    const isDestination = field[cellIndex(grid, cell)] === 0;
    const candidate = {
      x: cellCenter(cell.c) + (isDestination ? 0 : offset.x),
      y: cellCenter(cell.r) + (isDestination ? 0 : offset.y),
    };
    if (hasLineOfSight(grid, pos, candidate, radius, allow)) return candidate;
  }
  return { x: cellCenter(path[0]!.c), y: cellCenter(path[0]!.r) };
}

export function moveToward(
  pos: IPoint,
  headingDeg: number,
  target: IPoint,
  speedUnitsPerS: number,
  turnRateDeg: number,
  dtS: number,
): { pos: IPoint; heading: number } {
  const dx = target.x - pos.x;
  const dy = target.y - pos.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return { pos, heading: headingDeg };
  const desired = (Math.atan2(dy, dx) * 180) / Math.PI;
  const change = ((desired - headingDeg + 540) % 360) - 180;
  const limit = turnRateDeg * dtS;
  const heading = headingDeg + Math.max(-limit, Math.min(change, limit));
  const step = Math.min(speedUnitsPerS * dtS, distance);
  if (step === distance && Math.abs(change) <= limit) return { pos: target, heading };
  const radians = (heading * Math.PI) / 180;
  return {
    pos: { x: pos.x + Math.cos(radians) * step, y: pos.y + Math.sin(radians) * step },
    heading,
  };
}

export function resolveCollision(grid: IGrid, pos: IPoint, radius: number): IPoint {
  let x = Math.max(radius, Math.min(cellOrigin(grid.cols) - radius, pos.x));
  let y = Math.max(radius, Math.min(cellOrigin(grid.rows) - radius, pos.y));
  for (let pass = 0; pass < 4; pass++) {
    let moved = false;
    for (
      let r = Math.max(0, Math.floor((y - radius) / CELL));
      r <= Math.min(grid.rows - 1, Math.floor((y + radius) / CELL));
      r++
    ) {
      for (
        let c = Math.max(0, Math.floor((x - radius) / CELL));
        c <= Math.min(grid.cols - 1, Math.floor((x + radius) / CELL));
        c++
      ) {
        if (!grid.blocked[r * grid.cols + c] || !discOverlapsCell({ x, y }, radius, { c, r }))
          continue;
        const left = cellOrigin(c);
        const top = cellOrigin(r);
        const closestX = Math.max(left, Math.min(x, left + CELL));
        const closestY = Math.max(top, Math.min(y, top + CELL));
        const horizontal = x < left + CELL / 2 ? left - radius : left + CELL + radius;
        const vertical = y < top + CELL / 2 ? top - radius : top + CELL + radius;
        const dx = x - closestX;
        const dy = y - closestY;
        if (dx * dx + dy * dy >= radius * radius && (dx !== 0 || dy !== 0)) continue;
        if (Math.abs(horizontal - x) <= Math.abs(vertical - y)) x = horizontal;
        else y = vertical;
        x = Math.max(radius, Math.min(cellOrigin(grid.cols) - radius, x));
        y = Math.max(radius, Math.min(cellOrigin(grid.rows) - radius, y));
        moved = true;
      }
    }
    if (!moved) break;
  }
  return { x, y };
}
