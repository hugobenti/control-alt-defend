import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { balance } from "./balance.data";
import { filesInCore } from "./files";
import { discOverlapsCell } from "./grid";
import { applyCommand, createMatch, recomputeFields } from "./match";
import type { IEnemyState, IMatchState } from "./match.type";
import { enemyGoal, enemyStats, goalField, spawnDue, stepEnemies } from "./enemies";
import { runTicks, step } from "./step";

const base = () => createMatch({ map: homePc, seed: 7, startBits: 1000, files: 8 });
function spawnOne(state: IMatchState, type: "worm" | "rootkit", portId: string) {
  return spawnDue(applyCommand(state, { kind: "spawn", type, portId, count: 1 }));
}
function wormAt(state: IMatchState, pos: { x: number; y: number }): IMatchState {
  const spawned = spawnOne(state, "worm", "J1");
  return { ...spawned, enemies: [{ ...spawned.enemies[0]!, pos, offset: { x: 0, y: 0 } }] };
}

describe("enemy lifecycle", () => {
  it("spawns at a port center with inward heading and advances deterministic random state", () => {
    const state = base();
    const spawned = spawnOne(state, "worm", "J1");
    expect(spawned.enemies[0]).toMatchObject({
      id: 0,
      pos: { x: 20 },
      heading: 0,
      health: 30,
      maxHealth: 30,
      goal: "core",
    });
    expect([100, 140]).toContain(spawned.enemies[0]!.pos.y);
    expect(spawned.seed).not.toBe(state.seed);
    expect(spawned.nextId).toBe(1);
    expect(enemyStats({ ...spawned.enemies[0]!, small: true }).radius).toBe(7);
    expect(spawnOne(state, "worm", "J1")).toEqual(spawned);
  });

  it("moves 96 units in a second while turning at most nine degrees per tick", () => {
    let state = spawnOne(base(), "worm", "J1");
    let distance = 0;
    for (let i = 0; i < 60; i++) {
      const before = state.enemies[0]!;
      state = step(state);
      const after = state.enemies[0]!;
      distance += Math.hypot(after.pos.x - before.pos.x, after.pos.y - before.pos.y);
      const turn = Math.abs(((after.heading - before.heading + 540) % 360) - 180);
      expect(turn).toBeLessThanOrEqual(9.000001);
    }
    expect(distance).toBeGreaterThanOrEqual(95);
    expect(distance).toBeLessThanOrEqual(97);
  });

  it("steals one file on touching the core and heads to an exit", () => {
    let state = spawnOne(base(), "worm", "J1");
    for (let i = 0; i < 60 * 15 && state.enemies[0]?.carrying === null; i++) state = step(state);
    expect(state.enemies[0]?.carrying).not.toBeNull();
    expect(filesInCore(state)).toBe(7);
    expect(state.events).toContainEqual({ kind: "stolen", filesInCore: 7 });
    expect(state.enemies[0]?.goal).toBe("exit");
  });

  it("leaks a carried file at the nearest port and removes its carrier", () => {
    let state = wormAt(base(), { x: 880, y: 500 });
    const enemy = state.enemies[0]!;
    state = {
      ...state,
      enemies: [{ ...enemy, heading: 0, carrying: 0, goal: "exit" }],
      files: state.files.map((file) =>
        file.id === 0 ? { ...file, status: "carried", carrierId: enemy.id } : file,
      ),
    };
    const after = runTicks(state, 60);
    expect(after.enemies[0]?.pos.x ?? 940).toBeGreaterThan(880);
    for (let i = 0; i < 120 && state.enemies.length; i++) state = step(state);
    expect(state.files[0]!.status).toBe("leaked");
    expect(state.enemies).toEqual([]);
    expect(state.events).toContainEqual({ kind: "leaked", leaked: 1, total: 8 });
  });

  it("reroutes around a changed maze without ever entering a blocked cell", () => {
    let state = wormAt(base(), { x: 100, y: 100 });
    for (const r of [2, 3, 4, 1]) {
      state = applyCommand(state, { kind: "place", type: "firewall", cell: { c: 4, r } });
      expect(state.events.at(-1)?.kind).toBe("placed");
    }
    let furthest = 0;
    for (let i = 0; i < 300; i++) {
      state = step(state);
      const enemy = state.enemies[0]!;
      furthest = Math.max(furthest, enemy.pos.x);
      for (const r of [2, 3, 4, 1])
        expect(discOverlapsCell(enemy.pos, balance.enemies.worm.radius, { c: 4, r })).toBe(false);
    }
    expect(furthest).toBeGreaterThan(200);
  });

  it("pushes an enemy out of an occupied tower cell", () => {
    let state = applyCommand(base(), { kind: "place", type: "firewall", cell: { c: 4, r: 2 } });
    state = wormAt(state, { x: 155, y: 100 });
    state = step(state);
    expect(
      discOverlapsCell(state.enemies[0]!.pos, balance.enemies.worm.radius, { c: 4, r: 2 }),
    ).toBe(false);
  });

  it("heads to and picks up a dropped file when the core is empty", () => {
    let state = wormAt(base(), { x: 260, y: 260 });
    state = recomputeFields({
      ...state,
      files: state.files.map((file) =>
        file.id === 0
          ? { ...file, status: "dropped", pos: { x: 300, y: 260 } }
          : { ...file, status: "leaked" },
      ),
    });
    expect(enemyGoal(state, state.enemies[0]!)).toBe("file");
    for (let i = 0; i < 120 && state.enemies[0]?.carrying === null; i++) state = step(state);
    expect(state.enemies[0]?.carrying).toBe(0);
    expect(state.files[0]!.status).toBe("carried");
  });

  it("chooses the lowest-id dropped file on equal path lengths", () => {
    let state = wormAt(base(), { x: 260, y: 260 });
    const enemy = state.enemies[0]!;
    expect(goalField(state, enemy)).toBe(state.fields.toCore);
    state = recomputeFields({
      ...state,
      files: state.files.map((file) =>
        file.id < 2
          ? { ...file, status: "dropped", pos: { x: 300, y: 260 } }
          : { ...file, status: "leaked" },
      ),
    });
    expect(goalField(state, enemy)).toBe(state.fields.toFile[0]);
    expect(goalField(state, { ...enemy, carrying: 0 })).toBe(state.fields.toExit);
  });

  it("visits an empty core then leaves without a leak", () => {
    let state = wormAt(base(), { x: 410, y: 300 });
    state = { ...state, files: state.files.map((file) => ({ ...file, status: "leaked" })) };
    expect(enemyGoal(state, state.enemies[0]!)).toBe("core");
    for (let i = 0; i < 120 && !state.enemies[0]?.touchedEmptyCore; i++) state = stepEnemies(state);
    expect(state.enemies[0]?.touchedEmptyCore).toBe(true);
    expect(enemyGoal(state, state.enemies[0]!)).toBe("exit");
    for (let i = 0; i < 1200 && state.enemies.length; i++) state = stepEnemies(state);
    expect(state.enemies).toEqual([]);
    expect(state.events.some((event) => event.kind === "leaked")).toBe(false);
  });

  it("never pushes enemies away from one another", () => {
    const original = wormAt(base(), { x: 100, y: 100 });
    const enemy: IEnemyState = original.enemies[0]!;
    const alone = runTicks(original, 60).enemies[0]!;
    const together = runTicks({ ...original, enemies: [enemy, { ...enemy, id: 99 }] }, 60);
    expect(together.enemies[0]!.pos).toEqual(alone.pos);
    expect(together.enemies[1]!.pos).toEqual(alone.pos);
  });
});
