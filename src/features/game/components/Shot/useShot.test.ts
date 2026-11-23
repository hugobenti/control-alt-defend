import { describe, expect, it } from "vitest";

import { useShot } from "./useShot";

describe("Antivirus shot flight", () => {
  const shot = { from: { x: 200, y: 100 }, to: { x: 260, y: 180 } };

  it("starts at the tower and advances the glowing head along the shot line", () => {
    expect(useShot({ ...shot, progress: 0 }).transform).toBe(
      "translate(200,100) rotate(53.13010235415598)",
    );
    expect(useShot({ ...shot, progress: 0.5 }).transform).toBe(
      "translate(230,140) rotate(53.13010235415598)",
    );
    expect(useShot({ ...shot, progress: 1 }).transform).toBe(
      "translate(260,180) rotate(53.13010235415598)",
    );
  });

  it("holds the old streak at the tower and fades it without moving in reduced motion", () => {
    const halfway = useShot({ ...shot, progress: 0.5 });
    expect(halfway.staticTransform).toBe("translate(200,100) rotate(53.13010235415598)");
    expect(halfway.reducedOpacity).toBe(0.5);
    expect(useShot({ ...shot, progress: 1 }).reducedOpacity).toBe(0);
  });

  it("flashes only upon arrival and clamps the endpoint", () => {
    expect(useShot({ ...shot, progress: 0.5 }).impact).toBe(false);
    expect(useShot({ ...shot, progress: 1 }).impact).toBe(true);
    expect(useShot({ ...shot, progress: 2 }).transform).toBe(
      "translate(260,180) rotate(53.13010235415598)",
    );
  });
});
