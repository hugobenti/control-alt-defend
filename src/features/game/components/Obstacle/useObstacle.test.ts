import { describe, expect, it } from "vitest";

import { useObstacle } from "./useObstacle";

describe("capacitor geometry", () => {
  it("lays one part per bank cell and places the silkscreen beside the wall", () => {
    const bank = useObstacle({ kind: "capacitor", c: 8, r: 1, w: 1, h: 4, label: "C1–C4" });
    expect(bank.capacitors).toEqual([
      { x: 20, y: 20, transform: "translate(20 20)" },
      { x: 20, y: 60, transform: "translate(20 60)" },
      { x: 20, y: 100, transform: "translate(20 100)" },
      { x: 20, y: 140, transform: "translate(20 140)" },
    ]);
    expect(bank.capacitorLabel).toEqual({ x: 44, y: 24 });
  });

  it("lays a horizontal bank across its cells without changing single capacitors", () => {
    expect(
      useObstacle({ kind: "capacitor", c: 0, r: 0, w: 3, h: 1, label: "C1–C3" }).capacitors,
    ).toEqual([
      { x: 20, y: 20, transform: "translate(20 20)" },
      { x: 60, y: 20, transform: "translate(60 20)" },
      { x: 100, y: 20, transform: "translate(100 20)" },
    ]);
    expect(
      useObstacle({ kind: "capacitor", c: 0, r: 0, w: 1, h: 1, label: "C1" }).capacitorLabel,
    ).toEqual({ x: 2, y: -4 });
  });
});
