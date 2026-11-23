import { describe, expect, it } from "vitest";

import { useShot } from "./useShot";

describe("Antivirus shot flight", () => {
  const shot = {
    from: { x: 200, y: 100 },
    to: { x: 260, y: 160 },
    reducedOpacity: 0.5,
  };

  it("starts at the tower and advances the glowing head along the shot line", () => {
    expect(useShot({ ...shot, progress: 0 }).transform).toBe("translate(200,100) rotate(45)");
    expect(useShot({ ...shot, progress: 0.5 }).transform).toBe("translate(230,130) rotate(45)");
    expect(useShot({ ...shot, progress: 1 }).transform).toBe("translate(260,160) rotate(45)");
  });

  it("holds the old streak at the tower while reduced opacity stays independent of flight", () => {
    const halfway = useShot({ ...shot, progress: 0.5 });
    expect(halfway.staticTransform).toBe("translate(200,100) rotate(45)");
    expect(halfway.reducedOpacity).toBe(0.5);
    expect(useShot({ ...shot, progress: 1 }).reducedOpacity).toBe(0.5);
  });

  it("flashes only upon arrival and clamps the endpoint", () => {
    expect(useShot({ ...shot, progress: 0.5 }).impact).toBe(false);
    expect(useShot({ ...shot, progress: 1 }).impact).toBe(true);
    expect(useShot({ ...shot, progress: 2 }).transform).toBe("translate(260,160) rotate(45)");
  });
});
