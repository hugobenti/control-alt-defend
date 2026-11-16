import { describe, expect, it } from "vitest";

import { computeDistanceField, descend, pathCells } from "./distanceField";
import { buildStaticGrid, cellIndex, coreCells, withBlocked, withoutBlocked } from "./grid";
import { tinyMap } from "./testMaps";

const empty = withoutBlocked(buildStaticGrid(tinyMap), coreCells(tinyMap));
const source = { c: 0, r: 0 };

describe("8-connected distance field", () => {
  it("uses orthogonal and diagonal costs and descends to the source", () => {
    const field = computeDistanceField(empty, [source]);
    expect(field[cellIndex(empty, { c: 1, r: 1 })]).toBe(Math.SQRT2);
    expect(field[cellIndex(empty, { c: 5, r: 0 })]).toBe(5);
    expect(pathCells(field, empty, { c: 5, r: 5 }, 20)).toEqual([
      { c: 4, r: 4 },
      { c: 3, r: 3 },
      { c: 2, r: 2 },
      { c: 1, r: 1 },
      source,
    ]);
    expect(descend(field, empty, source)).toBeNull();
  });

  it("does not cut through corners touching blocked cells", () => {
    const grid = withBlocked(empty, [
      { c: 2, r: 2 },
      { c: 3, r: 3 },
    ]);
    const field = computeDistanceField(grid, [source]);
    expect(field[cellIndex(grid, { c: 2, r: 3 })]).toBe(3 + Math.SQRT2);
    expect(descend(field, grid, { c: 3, r: 2 })).toEqual({ c: 3, r: 1 });
    expect(field[cellIndex(grid, { c: 2, r: 2 })]).toBe(Infinity);
  });

  it("leaves enclosed cells unreachable and permits blocked core sources as destinations", () => {
    const ring = withBlocked(empty, [
      { c: 0, r: 1 },
      { c: 1, r: 0 },
      { c: 1, r: 1 },
    ]);
    expect(computeDistanceField(ring, [{ c: 5, r: 5 }])[cellIndex(ring, source)]).toBe(Infinity);
    const real = buildStaticGrid(tinyMap);
    expect(descend(computeDistanceField(real, coreCells(tinyMap)), real, { c: 3, r: 4 })).toEqual({
      c: 4,
      r: 4,
    });
  });
});
