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
