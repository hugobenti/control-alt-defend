import { describe, expect, it } from "vitest";

import { useBoostEdge } from "./useBoostEdge";

describe("boost edge view model", () => {
  it("draws a vertical bar on horizontal neighbors' shared edge", () => {
    expect(useBoostEdge({ from: { c: 6, r: 6 }, to: { c: 7, r: 6 } })).toEqual({
      x1: 280,
      y1: 250,
      x2: 280,
      y2: 270,
    });
  });

  it("omits diagonal and distant pairs", () => {
    expect(useBoostEdge({ from: { c: 6, r: 6 }, to: { c: 7, r: 7 } })).toBeNull();
    expect(useBoostEdge({ from: { c: 6, r: 6 }, to: { c: 8, r: 6 } })).toBeNull();
  });
});
