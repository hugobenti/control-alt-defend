import { cellIndex, inBounds } from "./grid";
import type { ICell, IGrid } from "./grid.type";

// Stable neighbor order also fixes tie-breaking in descent.
const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
] as const;

function enterable(grid: IGrid, field: Float64Array, c: number, r: number): boolean {
  return (
    c >= 0 &&
    c < grid.cols &&
    r >= 0 &&
    r < grid.rows &&
    (!grid.blocked[r * grid.cols + c] || field[r * grid.cols + c] === 0)
  );
}

function canStep(
  grid: IGrid,
  field: Float64Array,
  c: number,
  r: number,
  dc: number,
  dr: number,
): boolean {
  if (!enterable(grid, field, c + dc, r + dr)) return false;
  return (
    dc === 0 || dr === 0 || (enterable(grid, field, c + dc, r) && enterable(grid, field, c, r + dr))
  );
}

export function computeDistanceField(grid: IGrid, sources: ICell[]): Float64Array {
  const field = new Float64Array(grid.cols * grid.rows);
  field.fill(Infinity);
  // Sorted descending: pop takes the cheapest; insert with binary search.
  const queue: { index: number; cost: number }[] = [];
  for (const source of sources) {
    if (!inBounds(grid, source)) continue;
    const index = cellIndex(grid, source);
    if (field[index] === 0) continue;
    field[index] = 0;
    queue.push({ index, cost: 0 });
  }
  while (queue.length) {
    const current = queue.pop()!;
    if (current.cost !== field[current.index]) continue;
    const c = current.index % grid.cols;
    const r = Math.floor(current.index / grid.cols);
    for (const [dc, dr] of directions) {
      if (!canStep(grid, field, c, r, dc, dr)) continue;
      const index = (r + dr) * grid.cols + c + dc;
      const cost = current.cost + (dc !== 0 && dr !== 0 ? Math.SQRT2 : 1);
      if (cost >= field[index]!) continue;
      field[index] = cost;
      let low = 0;
      let high = queue.length;
      while (low < high) {
        const middle = (low + high) >>> 1;
        if (queue[middle]!.cost > cost) low = middle + 1;
        else high = middle;
      }
      queue.splice(low, 0, { index, cost });
    }
  }
  return field;
}

export function descend(field: Float64Array, grid: IGrid, cell: ICell): ICell | null {
  if (!inBounds(grid, cell)) return null;
  let best = field[cellIndex(grid, cell)]!;
  if (best === 0 || best === Infinity) return null;
  let result: ICell | null = null;
  for (const [dc, dr] of directions) {
    if (!canStep(grid, field, cell.c, cell.r, dc, dr)) continue;
    const cost = field[(cell.r + dr) * grid.cols + cell.c + dc]!;
    if (cost < best) {
      best = cost;
      result = { c: cell.c + dc, r: cell.r + dr };
    }
  }
  return result;
}

export function pathCells(field: Float64Array, grid: IGrid, from: ICell, max: number): ICell[] {
  const path: ICell[] = [];
  let current = from;
  for (let i = 0; i < max; i++) {
    const next = descend(field, grid, current);
    if (!next) break;
    path.push(next);
    current = next;
  }
  return path;
}
