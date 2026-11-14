import { describe, expect, it } from "vitest";

import { useTower } from "./useTower";

describe("tower view model", () => {
  it("aims straight up at zero degrees", () => {
    expect(
      useTower({ type: "antivirus", version: 1, c: 6, r: 6, aimAt: { x: 260, y: 200 } }).rotation,
    ).toBe(0);
  });

  it("aims right at ninety degrees", () => {
    expect(
      useTower({ type: "antivirus", version: 1, c: 6, r: 6, aimAt: { x: 300, y: 260 } }).rotation,
    ).toBe(90);
  });

  it("lights two of three pips at version two", () => {
    expect(
      useTower({ type: "firewall", version: 2, c: 6, r: 6 }).pips.map((pip) => pip.active),
    ).toEqual([true, true, false]);
  });
});
