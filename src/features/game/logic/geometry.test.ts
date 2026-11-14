import { describe, expect, it } from "vitest";

import { boardSize, cellCenter, cellOrigin } from "./geometry";

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
});
