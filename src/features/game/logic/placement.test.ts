import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { cellCenter } from "./geometry";
import { buildStaticGrid, coreRect, withBlocked } from "./grid";
import { checkPlacement, routePreview } from "./placement";
import type { IPlacementInput } from "./placement.type";
import { tinyMap } from "./testMaps";

const homeGrid = buildStaticGrid(homePc);
const homeInput: IPlacementInput = {
  map: homePc,
  grid: homeGrid,
  cell: { c: 6, r: 6 },
  cost: 20,
  bits: 1000,
  enemies: [],
  droppedFiles: [],
};
const tinyGrid = buildStaticGrid(tinyMap);
const tinyInput: IPlacementInput = { ...homeInput, map: tinyMap, grid: tinyGrid };

describe("placement", () => {
  it("refuses protected cells and occupied towers before testing routes", () => {
    for (const cell of [
      { c: 11, r: 7 },
      { c: 1, r: 2 },
      { c: 23, r: 12 },
      { c: 4, r: 9 },
    ]) {
      expect(checkPlacement({ ...homeInput, cell })).toBe("keepOut");
    }
    expect(checkPlacement({ ...homeInput, grid: withBlocked(homeGrid, [{ c: 6, r: 6 }]) })).toBe(
      "occupied",
    );
    expect(checkPlacement(homeInput)).toBeNull();
  });

  it("refuses overlapping discs both across cell edges and centered in the cell, then insufficient bits", () => {
    expect(
      checkPlacement({
        ...homeInput,
        cell: { c: 7, r: 6 },
        enemies: [{ pos: { x: 275, y: 260 }, radius: 10 }],
      }),
    ).toBe("overlapsEnemy");
    expect(
      checkPlacement({
        ...homeInput,
        cell: { c: 7, r: 6 },
        enemies: [{ pos: { x: 300, y: 260 }, radius: 10 }],
      }),
    ).toBe("overlapsEnemy");
    expect(
      checkPlacement({ ...homeInput, cell: { c: 7, r: 6 }, droppedFiles: [{ x: 300, y: 260 }] }),
    ).toBe("overlapsFile");
    expect(checkPlacement({ ...homeInput, bits: 10 })).toBe("notEnoughBits");
  });

  it("rejects a corner-only gap that seals the port", () => {
    const grid = withBlocked(tinyGrid, [
      { c: 2, r: 0 },
      { c: 2, r: 1 },
      { c: 2, r: 2 },
      { c: 3, r: 4 },
      { c: 3, r: 5 },
    ]);
    expect(checkPlacement({ ...tinyInput, grid, cell: { c: 3, r: 3 } })).toBe("blocksRoute");
    expect(checkPlacement({ ...tinyInput, grid, cell: { c: 2, r: 3 } })).toBe("blocksRoute");
    expect(checkPlacement({ ...tinyInput, grid, cell: { c: 4, r: 2 } })).toBeNull();
    expect(routePreview(tinyMap, grid, { c: 3, r: 3 })).toEqual([[]]);
  });

  it("rejects a trapped file or enemy even while port remains connected", () => {
    const grid = withBlocked(tinyGrid, [
      { c: 1, r: 3 },
      { c: 3, r: 3 },
      { c: 1, r: 4 },
      { c: 3, r: 4 },
      { c: 1, r: 5 },
      { c: 2, r: 5 },
      { c: 3, r: 5 },
    ]);
    const point = { x: cellCenter(2), y: cellCenter(4) };
    const input = { ...tinyInput, grid, cell: { c: 2, r: 3 } };
    expect(checkPlacement({ ...input, droppedFiles: [point] })).toBe("trapsPiece");
    expect(checkPlacement({ ...input, enemies: [{ pos: point, radius: 10 }] })).toBe("trapsPiece");
    expect(checkPlacement(input)).toBeNull();
  });

  it("previews both routes from the inside ports into the core", () => {
    const paths = routePreview(homePc, homeGrid, null);
    expect(paths).toHaveLength(2);
    expect(paths[0]![0]).toEqual({ x: 60, y: 100 });
    expect(paths[1]![0]).toEqual({ x: 900, y: 500 });
    const rect = coreRect(homePc);
    for (const path of paths) {
      const last = path.at(-1)!;
      expect(last.x).toBeGreaterThan(rect.x);
      expect(last.x).toBeLessThan(rect.x + rect.w);
      expect(last.y).toBeGreaterThan(rect.y);
      expect(last.y).toBeLessThan(rect.y + rect.h);
    }
    expect(routePreview(homePc, homeGrid, { c: 5, r: 2 })[0]).not.toContainEqual({
      x: 220,
      y: 100,
    });
  });
});
