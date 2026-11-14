import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import {
  buildStaticGrid,
  cellIndex,
  cellOf,
  coreCells,
  coreRect,
  discOverlapsCell,
  discTouchesRect,
  inBounds,
  portCells,
  portInsideCells,
  withBlocked,
  withoutBlocked,
} from "./grid";

const grid = buildStaticGrid(homePc);
const has = (mask: Uint8Array, c: number, r: number) => mask[cellIndex(grid, { c, r })] === 1;

describe("static grid", () => {
  it("blocks every obstacle and core cell, leaving empty cells open", () => {
    for (const [c, r] of [
      [4, 9],
      [6, 10],
      [11, 7],
      [12, 8],
      [10, 14],
    ] as const)
      expect(has(grid.blocked, c, r)).toBe(true);
    expect(has(grid.blocked, 0, 2)).toBe(false);
    expect(coreCells(homePc)).toEqual([
      { c: 11, r: 7 },
      { c: 12, r: 7 },
      { c: 11, r: 8 },
      { c: 12, r: 8 },
    ]);
    expect(Array.from(grid.core).reduce((sum, value) => sum + value, 0)).toBe(4);
  });

  it("marks both port cells, both inside cells, obstacles and core as unbuildable", () => {
    for (const [c, r] of [
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [23, 12],
      [23, 13],
      [22, 12],
      [22, 13],
      [4, 9],
      [11, 7],
      [12, 8],
    ] as const)
      expect(has(grid.keepOut, c, r)).toBe(true);
    expect(has(grid.keepOut, 6, 6)).toBe(false);
    expect(portCells(homePc, homePc.ports[0]!)).toEqual([
      { c: 0, r: 2 },
      { c: 0, r: 3 },
    ]);
    expect(portInsideCells(homePc, homePc.ports[1]!)).toEqual([
      { c: 22, r: 12 },
      { c: 22, r: 13 },
    ]);
  });

  it("maps core and disc geometry to board units", () => {
    expect(coreRect(homePc)).toEqual({ x: 440, y: 280, w: 80, h: 80 });
    expect(cellOf({ x: 259, y: 40 })).toEqual({ c: 6, r: 1 });
    expect(discOverlapsCell({ x: 275, y: 260 }, 10, { c: 7, r: 6 })).toBe(true);
    expect(discOverlapsCell({ x: 275, y: 260 }, 4, { c: 7, r: 6 })).toBe(false);
    expect(discTouchesRect({ x: 5, y: 5 }, 10, { x: 15, y: 0, w: 10, h: 10 })).toBe(true);
  });

  it("changes blocked cells without mutating the input or other masks", () => {
    const changed = withBlocked(grid, [{ c: 6, r: 6 }]);
    expect(changed.blocked).not.toBe(grid.blocked);
    expect(changed.keepOut).toBe(grid.keepOut);
    expect(changed.core).toBe(grid.core);
    expect(changed.blocked[cellIndex(grid, { c: 6, r: 6 })]).toBe(1);
    expect(grid.blocked[cellIndex(grid, { c: 6, r: 6 })]).toBe(0);
    expect(withoutBlocked(changed, [{ c: 6, r: 6 }]).blocked[cellIndex(grid, { c: 6, r: 6 })]).toBe(
      0,
    );
    expect(inBounds(grid, { c: -1, r: 2 })).toBe(false);
  });
});
