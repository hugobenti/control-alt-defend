import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import type { ILevelMap } from "../level/level.type";
import { boardOutline } from "./boardOutline";
import { CELL } from "./geometry";
import { tinyMap } from "./testMaps";

/** Parse the `M/H/V/Z` outline into polygons and test a point with the SVG nonzero rule. */
function covers(path: string, c: number, r: number): boolean {
  const px = (c + 0.5) * CELL;
  const py = (r + 0.5) * CELL;
  const polygons: [number, number][][] = [];
  let x = 0;
  let y = 0;
  for (const [, command, value] of path.matchAll(/([MHVZ])\s*(-?\d*(?:\s-?\d+)?)/g)) {
    if (command === "M") {
      [x, y] = value!.split(" ").map(Number) as [number, number];
      polygons.push([[x, y]]);
    } else if (command === "H") {
      x = Number(value);
      polygons.at(-1)!.push([x, y]);
    } else if (command === "V") {
      y = Number(value);
      polygons.at(-1)!.push([x, y]);
    }
  }
  let winding = 0;
  for (const polygon of polygons) {
    polygon.forEach(([x1, y1], i) => {
      const [x2, y2] = polygon[(i + 1) % polygon.length]!;
      const side = (x2 - x1) * (py - y1) - (px - x1) * (y2 - y1);
      if (y1 <= py && y2 > py && side > 0) winding++;
      if (y1 > py && y2 <= py && side < 0) winding--;
    });
  }
  return winding !== 0;
}

const withVoids = (voids: ILevelMap["voids"]): ILevelMap => ({ ...tinyMap, voids });

describe("board outline", () => {
  it("covers every Home PC board cell and leaves the corner cut-outs empty", () => {
    const outline = boardOutline(homePc);
    expect(covers(outline, 0, 0)).toBe(true);
    expect(covers(outline, 19, 0)).toBe(true);
    expect(covers(outline, 4, 15)).toBe(true);
    expect(covers(outline, 23, 15)).toBe(true);
    expect(covers(outline, 20, 0)).toBe(false);
    expect(covers(outline, 23, 2)).toBe(false);
    expect(covers(outline, 0, 13)).toBe(false);
    expect(covers(outline, 3, 15)).toBe(false);
  });

  it("keeps ordinary levels rectangular", () => {
    expect(boardOutline(tinyMap)).toBe("M0 0 H240 V240 H0 Z");
  });

  it("leaves an interior void as a hole", () => {
    const outline = boardOutline(withVoids([{ c: 2, r: 2, w: 2, h: 2 }]));
    expect(covers(outline, 2, 2)).toBe(false);
    expect(covers(outline, 3, 3)).toBe(false);
    expect(covers(outline, 1, 2)).toBe(true);
    expect(covers(outline, 4, 3)).toBe(true);
  });

  it("draws both halves of a board split by a void", () => {
    const outline = boardOutline(withVoids([{ c: 2, r: 0, w: 1, h: 6 }]));
    expect(covers(outline, 0, 3)).toBe(true);
    expect(covers(outline, 2, 3)).toBe(false);
    expect(covers(outline, 5, 3)).toBe(true);
  });

  it("separates cells that touch only at a corner", () => {
    const outline = boardOutline(
      withVoids([
        { c: 3, r: 0, w: 3, h: 3 },
        { c: 0, r: 3, w: 3, h: 3 },
      ]),
    );
    expect(covers(outline, 2, 2)).toBe(true);
    expect(covers(outline, 3, 3)).toBe(true);
    expect(covers(outline, 3, 2)).toBe(false);
    expect(covers(outline, 2, 3)).toBe(false);
  });
});
