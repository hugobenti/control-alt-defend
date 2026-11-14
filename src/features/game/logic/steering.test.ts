import { describe, expect, it } from "vitest";

import { computeDistanceField } from "./distanceField";
import { buildStaticGrid, coreCells, withBlocked, withoutBlocked } from "./grid";
import { hasLineOfSight, moveToward, nextWaypoint, resolveCollision } from "./steering";
import { tinyMap } from "./testMaps";

const empty = withoutBlocked(buildStaticGrid(tinyMap), coreCells(tinyMap));

describe("steering", () => {
  it("checks sampled line of sight with disc clearance and optional core access", () => {
    expect(hasLineOfSight(empty, { x: 20, y: 20 }, { x: 220, y: 20 }, 10, null)).toBe(true);
    const wall = withBlocked(empty, [{ c: 2, r: 0 }]);
    expect(hasLineOfSight(wall, { x: 20, y: 20 }, { x: 220, y: 20 }, 10, null)).toBe(false);
    const offset = withBlocked(empty, [{ c: 2, r: 2 }]);
    expect(hasLineOfSight(offset, { x: 20, y: 72 }, { x: 220, y: 72 }, 10, null)).toBe(false);
    expect(hasLineOfSight(offset, { x: 20, y: 72 }, { x: 220, y: 72 }, 4, null)).toBe(true);
    const core = buildStaticGrid(tinyMap);
    expect(hasLineOfSight(core, { x: 140, y: 180 }, { x: 180, y: 180 }, 10, core.core)).toBe(true);
    expect(hasLineOfSight(core, { x: 140, y: 180 }, { x: 180, y: 180 }, 10, null)).toBe(false);
  });

  it("aims at farthest visible path center and omits offset at the destination", () => {
    const field = computeDistanceField(empty, [{ c: 5, r: 5 }]);
    expect(nextWaypoint(empty, field, { x: 20, y: 20 }, 4, { x: 8, y: 8 }, null)).toEqual({
      x: 220,
      y: 220,
    });
    expect(nextWaypoint(empty, field, { x: 220, y: 220 }, 4, { x: 0, y: 0 }, null)).toBeNull();
    const blocked = withBlocked(empty, [{ c: 3, r: 3 }]);
    const detour = nextWaypoint(
      blocked,
      computeDistanceField(blocked, [{ c: 5, r: 5 }]),
      { x: 20, y: 20 },
      4,
      { x: 0, y: 0 },
      null,
    );
    expect(detour).not.toEqual({ x: 220, y: 220 });
    expect(detour).not.toBeNull();
    expect(hasLineOfSight(blocked, { x: 20, y: 20 }, detour!, 4, null)).toBe(true);
  });

  it("turns by a bounded angle and stops at a nearby target", () => {
    expect(moveToward({ x: 20, y: 20 }, 0, { x: 20, y: 200 }, 96, 540, 1 / 60).heading).toBe(9);
    expect(moveToward({ x: 20, y: 20 }, 0, { x: 21, y: 20 }, 96, 540, 1 / 60).pos).toEqual({
      x: 21,
      y: 20,
    });
  });

  it("pushes discs outside walls and board edges without moving free discs", () => {
    const grid = withBlocked(empty, [{ c: 2, r: 2 }]);
    expect(resolveCollision(grid, { x: 85, y: 100 }, 10).x).toBe(70);
    expect(resolveCollision(grid, { x: 20, y: 20 }, 10)).toEqual({ x: 20, y: 20 });
    expect(resolveCollision(grid, { x: 2, y: 100 }, 10).x).toBe(10);
  });
});
