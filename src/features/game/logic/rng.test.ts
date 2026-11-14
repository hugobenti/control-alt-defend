import { describe, expect, it } from "vitest";

import { nextRandom, randomRange } from "./rng";

describe("seeded randomness", () => {
  it("replays identical values and next seeds", () => {
    expect(nextRandom(42)).toEqual(nextRandom(42));
    expect(nextRandom(42).seed).not.toBe(42);
  });

  it("keeps 1000 successive values in [0, 1)", () => {
    let seed = 42;
    for (let i = 0; i < 1000; i++) {
      const draw = nextRandom(seed);
      expect(draw.value).toBeGreaterThanOrEqual(0);
      expect(draw.value).toBeLessThan(1);
      seed = draw.seed;
    }
  });

  it("scales a seeded draw to a half-open range", () => {
    const draw = randomRange(1, -8, 8);
    expect(draw.value).toBeGreaterThanOrEqual(-8);
    expect(draw.value).toBeLessThan(8);
    expect(draw.seed).toBe(nextRandom(1).seed);
  });
});
