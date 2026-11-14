import { describe, expect, it } from "vitest";

import { buildCost, sellRefund, upgradeCost } from "./economy";

describe("economy", () => {
  it("prices initial builds and each upgrade, stopping after version three", () => {
    expect(buildCost("antivirus")).toBe(60);
    expect(upgradeCost("antivirus", 1)).toBe(90);
    expect(upgradeCost("debugger", 2)).toBe(300);
    expect(upgradeCost("firewall", 3)).toBeNull();
  });

  it("rounds selling refunds down", () => {
    expect(sellRefund(150)).toBe(105);
    expect(sellRefund(21)).toBe(14);
  });
});
