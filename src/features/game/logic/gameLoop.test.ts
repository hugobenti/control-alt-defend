import { describe, expect, it } from "vitest";

import { MAX_FRAME_S, ticksToRun } from "./gameLoop";

describe("ticksToRun", () => {
  it("advances one tick at 60 Hz and two at double speed", () => {
    expect(ticksToRun(0, 1 / 60, 1).ticks).toBe(1);
    expect(ticksToRun(0, 1 / 60, 1).rest).toBeCloseTo(0);
    expect(ticksToRun(0, 1 / 60, 2).ticks).toBe(2);
  });

  it.each([1, 2] as const)("matches 120 Hz and 60 Hz after a second at %s×", (speed) => {
    const run = (frames: number, frameS: number) => {
      let rest = 0;
      let ticks = 0;
      for (let i = 0; i < frames; i++) {
        const next = ticksToRun(rest, frameS, speed);
        rest = next.rest;
        ticks += next.ticks;
      }
      return ticks;
    };
    expect(run(120, 1 / 120)).toBe(60 * speed);
    expect(run(60, 1 / 60)).toBe(60 * speed);
  });

  it("clamps a hidden-tab-sized gap instead of simulating all five seconds", () => {
    expect(ticksToRun(0, 5, 1).ticks).toBeLessThanOrEqual(6);
    expect(ticksToRun(0, 5, 1)).toEqual(ticksToRun(0, MAX_FRAME_S, 1));
  });
});
