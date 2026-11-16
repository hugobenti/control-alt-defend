import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { balance } from "./balance.data";
import { applyHit, pickTarget, remainingPath, stepCombat } from "./combat";
import { cellIndex, cellOf, discOverlapsCell } from "./grid";
import { applyCommand, createMatch, recomputeFields } from "./match";
import type { IEnemyState, IMatchState } from "./match.type";

const base = () => createMatch({ map: homePc, seed: 3, startBits: 1000, files: 8 });
const place = (state: IMatchState, type: "antivirus" | "debugger" | "firewall", c = 6, r = 6) =>
  applyCommand(state, { kind: "place", type, cell: { c, r } });
const enemy = (
  id: number,
  pos: { x: number; y: number },
  changes: Partial<IEnemyState> = {},
): IEnemyState => ({
  id,
  type: "worm",
  small: false,
  pos,
  heading: 0,
  health: 30,
  maxHealth: 30,
  carrying: null,
  offset: { x: 0, y: 0 },
  hitUntilTick: 0,
  touchedEmptyCore: false,
  goal: "core",
  ...changes,
});
const parked = (state: IMatchState, count: number) => {
  for (let i = 0; i < count; i++) state = { ...stepCombat(state), tick: state.tick + 1 };
  return state;
};

describe("combat", () => {
  it("prioritizes carriers, then shortest remaining route and lowest id; excludes out-of-range centers", () => {
    const state = place(base(), "antivirus");
    const tower = state.towers[0]!;
    const near = enemy(2, { x: 260, y: 220 });
    const far = enemy(3, { x: 300, y: 220 }, { carrying: 0, goal: "exit" });
    const other = enemy(1, { x: 260, y: 300 });
    const fields = {
      ...state.fields,
      toCore: state.fields.toCore.slice(),
      toExit: state.fields.toExit.slice(),
    };
    fields.toCore[cellIndex(state.grid, cellOf(near.pos))] = 1;
    fields.toCore[cellIndex(state.grid, cellOf(other.pos))] = 2;
    fields.toExit[cellIndex(state.grid, cellOf(far.pos))] = 30;
    const withEnemies = { ...state, fields, enemies: [near, far, other] };
    expect(remainingPath(withEnemies, far)).toBe(30);
    expect(pickTarget(withEnemies, tower, 3)).toBe(far);
    expect(pickTarget({ ...withEnemies, enemies: [other, near] }, tower, 3)).toBe(near);
    expect(
      pickTarget({ ...withEnemies, enemies: [other, { ...other, id: 0 }] }, tower, 3)?.id,
    ).toBe(0);
    expect(
      pickTarget({ ...withEnemies, enemies: [enemy(4, { x: 381, y: 260 })] }, tower, 3),
    ).toBeNull();
  });

  it("rootkit armor reduces each hit, but never below one damage", () => {
    const rootkit = enemy(1, { x: 300, y: 260 }, { type: "rootkit", health: 320, maxHealth: 320 });
    expect(applyHit(rootkit, 10, 3)).toMatchObject({ health: 316, hitUntilTick: 11 });
    expect(applyHit(rootkit, 3, 3).health).toBe(319);
    expect(rootkit.health).toBe(320);
  });

  it("kills a full worm in three Antivirus shots, splits perpendicular, and pays the last hitter", () => {
    const initial = place(base(), "antivirus");
    const state = parked({ ...initial, enemies: [enemy(10, { x: 300, y: 260 })], nextId: 11 }, 61);
    expect(state.enemies.map((item) => item.small)).toEqual([true, true]);
    expect(state.enemies.map((item) => item.pos)).toEqual([
      { x: 300, y: 270 },
      { x: 300, y: 250 },
    ]);
    expect(state.enemies.map((item) => item.id)).toEqual([11, 12]);
    expect(state.bits).toBe(initial.bits + 8);
    expect(state.towers[0]!.kills).toBe(1);
    expect(state.events).toContainEqual({ kind: "killed", type: "worm", reward: 8 });
    expect(state.shots).toHaveLength(1);
    expect(parked(state, balance.movement.shotTicks).shots).toEqual([]);
  });

  it("pays a small worm's reward without splitting again", () => {
    const initial = place(base(), "antivirus");
    const state = parked(
      {
        ...initial,
        enemies: [enemy(10, { x: 300, y: 260 }, { small: true, health: 12, maxHealth: 12 })],
      },
      31,
    );
    expect(state.enemies).toEqual([]);
    expect(state.bits).toBe(initial.bits + 3);
  });

  it("pierces the first aligned enemy beyond the v3 Antivirus target, not one off the line", () => {
    const initial = place(base(), "antivirus");
    const tower = { ...initial.towers[0]!, version: 3 as const };
    const state = stepCombat({
      ...initial,
      towers: [tower],
      enemies: [
        enemy(1, { x: 300, y: 260 }, { carrying: 0 }),
        enemy(2, { x: 340, y: 260 }),
        enemy(3, { x: 340, y: 290 }),
      ],
    });
    expect(state.enemies.map((item) => item.health)).toEqual([8, 8, 30]);
    expect(state.shots).toEqual([
      { from: { x: 260, y: 260 }, to: { x: 300, y: 260 }, untilTick: 6 },
    ]);
    expect(state.towers[0]!.cooldownTicks).toBe(20);
  });

  it("ramps Debugger pulses at beam ticks 0, 15, 30 and reaches 24 at tick 180", () => {
    const initial = place(base(), "debugger");
    let state = {
      ...initial,
      enemies: [enemy(10, { x: 300, y: 260 }, { type: "rootkit", health: 1000, maxHealth: 1000 })],
    };
    state = parked(state, 1);
    expect(state.enemies[0]!.health).toBe(998);
    expect(state.beams[0]!.ramp).toBe(0);
    state = parked(state, 15);
    expect(state.enemies[0]!.health).toBeCloseTo(994.6666666667);
    state = parked(state, 15);
    expect(state.enemies[0]!.health).toBeCloseTo(990);
    state = parked(state, 150);
    expect(state.towers[0]!.beamTicks).toBe(180);
    state = parked(state, 1);
    expect(state.enemies[0]!.health).toBeCloseTo(870);
    expect(state.beams[0]!.ramp).toBe(1);
  });

  it("resets a ramped Debugger beam on the tick its target dies", () => {
    const initial = place(base(), "debugger");
    let state = parked(
      {
        ...initial,
        enemies: [enemy(10, { x: 300, y: 260 }, { type: "rootkit", health: 320, maxHealth: 320 })],
      },
      31,
    );
    expect(state.towers[0]).toMatchObject({ beamTargetId: 10, beamTicks: 30 });
    state = parked({ ...state, enemies: [{ ...state.enemies[0]!, health: 6 }] }, 15);
    expect(state.enemies).toEqual([]);
    expect(state.towers[0]).toMatchObject({ beamTargetId: null, beamTicks: 0, kills: 1 });
    state = stepCombat({ ...state, enemies: [enemy(11, { x: 300, y: 260 })] });
    expect(state.beams[0]!.ramp).toBe(0);
  });

  it("chains a v3 Debugger pulse to the closest secondary enemy", () => {
    const initial = place(base(), "debugger");
    const state = stepCombat({
      ...initial,
      towers: [{ ...initial.towers[0]!, version: 3 }],
      enemies: [
        enemy(10, { x: 300, y: 260 }, { carrying: 0 }),
        enemy(11, { x: 340, y: 260 }),
        enemy(12, { x: 380, y: 260 }),
      ],
    });
    expect(state.enemies.map((item) => item.health)).toEqual([14, 22, 30]);
    expect(state.beams[0]!.chainTo).toEqual({ x: 340, y: 260 });
  });

  it("drops a carrier's file at its death position", () => {
    const initial = place(base(), "antivirus");
    const carrier = enemy(10, { x: 300, y: 260 }, { carrying: 0, goal: "exit", health: 10 });
    const state = stepCombat(
      recomputeFields({
        ...initial,
        enemies: [carrier],
        files: initial.files.map((file) =>
          file.id === 0 ? { ...file, status: "carried", carrierId: 10 } : file,
        ),
      }),
    );
    expect(state.files[0]).toMatchObject({
      status: "dropped",
      pos: { x: 300, y: 260 },
      carrierId: null,
    });
    expect(state.events).toContainEqual({ kind: "dropped" });
  });

  it("pushes split halves and a dropped file out of a nearby Firewall", () => {
    let initial = place(base(), "firewall", 7, 6);
    initial = place(initial, "antivirus", 5, 6);
    const carrier = enemy(
      10,
      { x: 270, y: 260 },
      { carrying: 0, goal: "exit", health: 10, heading: 90 },
    );
    const state = stepCombat(
      recomputeFields({
        ...initial,
        enemies: [carrier],
        files: initial.files.map((file) =>
          file.id === 0 ? { ...file, status: "carried", carrierId: 10 } : file,
        ),
      }),
    );
    const file = state.files[0]!;
    expect(file.status).toBe("dropped");
    expect(state.grid.blocked[cellIndex(state.grid, cellOf(file.pos!))]).toBe(0);
    expect(state.enemies.map((half) => half.pos.x)).toEqual([260, 273 - 1e-6]);
    for (const half of state.enemies) {
      expect(discOverlapsCell(half.pos, balance.enemies.wormSmall.radius, { c: 7, r: 6 })).toBe(
        false,
      );
    }
  });

  it("drops a carrier pressed inside a wall into an open cell", () => {
    let initial = place(base(), "firewall", 7, 6);
    initial = place(initial, "antivirus", 5, 6);
    const carrier = enemy(
      10,
      { x: 285, y: 260 },
      { type: "rootkit", health: 4, carrying: 0, goal: "exit" },
    );
    const state = stepCombat(
      recomputeFields({
        ...initial,
        enemies: [carrier],
        files: initial.files.map((file) =>
          file.id === 0 ? { ...file, status: "carried", carrierId: 10 } : file,
        ),
      }),
    );
    expect(state.files[0]!.pos!.x).toBe(274 - 1e-6);
    expect(state.grid.blocked[cellIndex(state.grid, cellOf(state.files[0]!.pos!))]).toBe(0);
  });

  it("applies Firewall v3 damage and range boosts to Antivirus", () => {
    let initial = place(base(), "firewall", 6, 5);
    initial = applyCommand(initial, { kind: "upgrade", towerId: initial.towers[0]!.id });
    initial = applyCommand(initial, { kind: "upgrade", towerId: initial.towers[0]!.id });
    initial = place(initial, "antivirus", 6, 6);
    const state = stepCombat({ ...initial, enemies: [enemy(10, { x: 260 + 3.9 * 40, y: 260 })] });
    expect(state.enemies[0]!.health).toBe(15);
  });
});
