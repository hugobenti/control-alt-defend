import { describe, expect, it } from "vitest";

import { boardSize, cellCenter, cellOrigin, pointToCell } from "./geometry";

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

  it("excludes SVG letterboxing when the element aspect ratio differs from its viewBox", () => {
    const rect = { left: 0, top: 0, width: 1200, height: 672 };
    expect(pointToCell(50, 336, rect, homePc)).toBeNull();
    expect(pointToCell(600, 336, rect, homePc)).toEqual({ c: 12, r: 8 });
  });
});
