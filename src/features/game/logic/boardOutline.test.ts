import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { boardOutline } from "./boardOutline";
import { tinyMap } from "./testMaps";

describe("board outline", () => {
  it("follows the Home PC banks of missing cells rather than enclosing a rectangle", () => {
    expect(boardOutline(homePc)).toBe("M0 0 H800 V120 H960 V640 H160 V520 H0 Z");
  });

  it("keeps ordinary levels rectangular", () => {
    expect(boardOutline(tinyMap)).toBe("M0 0 H240 V240 H0 Z");
  });
});
