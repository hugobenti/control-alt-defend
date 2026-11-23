import { describe, expect, it } from "vitest";

import { boardSize, cellCenter, cellOrigin, moveBoardCursor, pointToCell } from "./geometry";

import { homePc } from "../level/homePc.data";

describe("board geometry", () => {
  it("centers the first and last Home PC columns", () => {
    expect(cellCenter(0)).toBe(20);
    expect(cellCenter(23)).toBe(940);
  });

  it("places a cell at its grid origin", () => {
    expect(cellOrigin(3)).toBe(120);
  });

  it("sizes the Home PC surface in SVG units", () => {
    expect(boardSize(24, 16)).toEqual({ width: 960, height: 640 });
  });
  it("maps a pointer through the padded board viewBox and excludes the margins", () => {
    const rect = { left: 0, top: 0, width: 992, height: 672 };
    expect(pointToCell(496, 336, rect, homePc)).toEqual({ c: 12, r: 8 });
    expect(pointToCell(4, 4, rect, homePc)).toBeNull();
  });
  it("does not select cut-out cells but selects their neighboring board cells", () => {
    const rect = { left: 0, top: 0, width: 992, height: 672 };
    expect(pointToCell(836, 36, rect, homePc)).toBeNull();
    expect(pointToCell(36, 556, rect, homePc)).toBeNull();
    expect(pointToCell(796, 36, rect, homePc)).toEqual({ c: 19, r: 0 });
    expect(pointToCell(36, 516, rect, homePc)).toEqual({ c: 0, r: 12 });
  });
  it("keeps keyboard movement on its current cell when the next cell is void", () => {
    expect(moveBoardCursor({ c: 19, r: 1 }, 1, 0, homePc)).toEqual({ c: 19, r: 1 });
    expect(moveBoardCursor({ c: 3, r: 12 }, 0, 1, homePc)).toEqual({ c: 3, r: 12 });
    expect(moveBoardCursor({ c: 19, r: 1 }, 0, 1, homePc)).toEqual({ c: 19, r: 2 });
    expect(moveBoardCursor({ c: 0, r: 0 }, -1, 0, homePc)).toEqual({ c: 0, r: 0 });
  });

  it("excludes SVG letterboxing when the element aspect ratio differs from its viewBox", () => {
    const rect = { left: 0, top: 0, width: 1200, height: 672 };
    expect(pointToCell(50, 336, rect, homePc)).toBeNull();
    expect(pointToCell(600, 336, rect, homePc)).toEqual({ c: 12, r: 8 });
  });
});
