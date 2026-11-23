import { describe, expect, it } from "vitest";

import type { IEnemyProps } from "./Enemy.type";
import { useEnemy } from "./useEnemy";

const base: IEnemyProps = { type: "worm", x: 100, y: 60, heading: 0, health: 0.3 };
const offsets = (transforms: readonly string[]) =>
  transforms.map((transform) => Number.parseFloat(transform.slice(12, -1)));

describe("enemy view model", () => {
  it("sizes the health bar of a full-size enemy against 24 units", () => {
    expect(useEnemy(base).barWidth).toBe(7.2);
    expect(useEnemy(base).trackWidth).toBe(24);
  });

  it("sizes the health bar of a small enemy against 16 units", () => {
    expect(useEnemy({ ...base, small: true }).barWidth).toBe(4.8);
    expect(useEnemy({ ...base, small: true }).trackWidth).toBe(16);
  });

  it("clamps health between empty and full", () => {
    expect(useEnemy({ ...base, health: 1.7 }).barWidth).toBe(24);
    expect(useEnemy({ ...base, health: -0.4 }).barWidth).toBe(0);
  });

  it("names the carrying state only for carriers", () => {
    expect(useEnemy(base).label).toBe("Worm, 30% health");
    expect(useEnemy({ ...base, carrier: true }).label).toBe("Worm, 30% health, carrying a file");
  });

  it("names the armor of a rootkit and gives only rootkits the armor plate", () => {
    const rootkit = useEnemy({ ...base, type: "rootkit", health: 0.8, carrier: true });
    expect(rootkit.label).toBe("Rootkit, 80% health, armored, carrying a file");
    expect(rootkit.armored).toBe(true);
    expect(useEnemy(base).armored).toBe(false);
  });

  it("draws the glitch copies and slice only on a hit", () => {
    expect(useEnemy(base).layers).toEqual(["main"]);
    expect(useEnemy({ ...base, hit: true }).layers).toEqual(["ghostShift", "ghostLight", "main"]);
  });

  it("rotates and shrinks the body but keeps the bar upright", () => {
    expect(useEnemy({ ...base, heading: 90, small: true }).bodyTransform).toBe(
      "rotate(90) scale(0.68)",
    );
  });

  it("moves the head first and propagates a sideways wave toward the tail", () => {
    const headFirst = offsets(useEnemy({ ...base, id: 0, motionTick: 0 }).wormTransforms);
    const tailLater = offsets(useEnemy({ ...base, id: 0, motionTick: 8 }).wormTransforms);
    expect(headFirst[3]).toBeCloseTo(0);
    expect(headFirst[0]).toBeGreaterThan(0);
    expect(tailLater[3]).toBeGreaterThan(0);
    expect(tailLater[0]).toBeCloseTo(0);
  });

  it("advances only with simulation ticks and offsets different worms", () => {
    const first = offsets(useEnemy({ ...base, id: 1, motionTick: 5 }).wormTransforms);
    expect(offsets(useEnemy({ ...base, id: 1, motionTick: 5 }).wormTransforms)).toEqual(first);
    expect(offsets(useEnemy({ ...base, id: 1, motionTick: 6 }).wormTransforms)).not.toEqual(first);
    expect(offsets(useEnemy({ ...base, id: 2, motionTick: 5 }).wormTransforms)).not.toEqual(first);
  });

  it("keeps bare art and rootkits still while small worms share the scaled wave", () => {
    expect(offsets(useEnemy({ ...base, id: 3, motionTick: 5, bare: true }).wormTransforms)).toEqual(
      [0, 0, 0, 0],
    );
    expect(
      offsets(useEnemy({ ...base, id: 3, motionTick: 5, type: "rootkit" }).wormTransforms),
    ).toEqual([0, 0, 0, 0]);
    expect(
      offsets(useEnemy({ ...base, id: 3, motionTick: 5, small: true }).wormTransforms),
    ).toEqual(offsets(useEnemy({ ...base, id: 3, motionTick: 5 }).wormTransforms));
  });
});
