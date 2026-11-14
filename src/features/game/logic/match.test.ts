import { describe, expect, expectTypeOf, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { cellIndex } from "./grid";
import { applyCommand, createMatch, recomputeFields } from "./match";
import type {
  IBeamState,
  IEnemyState,
  IFileState,
  IMatchOptions,
  IMatchState,
  IPendingSpawn,
  IShotState,
  TEnemyGoal,
  TFileStatus,
  TMatchStatus,
} from "./match.type";

const options: IMatchOptions = { map: homePc, seed: 1, startBits: 1000, files: 8 };
const cell = { c: 6, r: 6 };

describe("match", () => {
  it("exposes typed entities and lifecycle states for simulation consumers", () => {
    expectTypeOf<IMatchState["enemies"][number]>().toEqualTypeOf<IEnemyState>();
    expectTypeOf<IMatchState["files"][number]>().toEqualTypeOf<IFileState>();
    expectTypeOf<IMatchState["shots"][number]>().toEqualTypeOf<IShotState>();
    expectTypeOf<IMatchState["beams"][number]>().toEqualTypeOf<IBeamState>();
    expectTypeOf<IMatchState["pendingSpawns"][number]>().toEqualTypeOf<IPendingSpawn>();
    expectTypeOf<IEnemyState["goal"]>().toEqualTypeOf<TEnemyGoal>();
    expectTypeOf<IFileState["status"]>().toEqualTypeOf<TFileStatus>();
    expectTypeOf<IMatchState["status"]>().toEqualTypeOf<TMatchStatus>();
  });

  it("initializes file states and distance fields to the core and ports", () => {
    const state = createMatch(options);
    expect(state.files).toEqual(
      Array.from({ length: 8 }, (_, id) => ({
        id,
        status: "core",
        pos: null,
        carrierId: null,
        heading: 0,
      })),
    );
    expect(state.seed).toBe(1);
    expect(state.events).toEqual([]);
    expect(state.fields.toCore[cellIndex(state.grid, { c: 1, r: 2 })]).toBeLessThan(Infinity);
    expect(state.fields.toCore[cellIndex(state.grid, { c: 11, r: 7 })]).toBe(0);
    expect(state.fields.toExit[cellIndex(state.grid, { c: 0, r: 2 })]).toBe(0);
    expect(state.fields.toExit[cellIndex(state.grid, { c: 23, r: 13 })]).toBe(0);
  });

  it("places a tower without changing the original and refuses occupied and unaffordable cells", () => {
    const start = createMatch(options);
    const snapshot = structuredClone(start);
    const placed = applyCommand(start, { kind: "place", type: "antivirus", cell });
    expect(structuredClone(start)).toEqual(snapshot);
    expect(placed.bits).toBe(940);
    expect(placed.towers).toMatchObject([{ type: "antivirus", version: 1, spent: 60, c: 6, r: 6 }]);
    expect(placed.towers[0]).toMatchObject({
      cooldownTicks: 0,
      beamTargetId: null,
      beamTicks: 0,
      kills: 0,
      aimAt: null,
    });
    expect(placed.grid.blocked[cellIndex(placed.grid, cell)]).toBe(1);
    expect(placed.events).toEqual([{ kind: "placed", towerId: placed.towers[0]!.id }]);
    expect(placed.fields.toCore).not.toBe(start.fields.toCore);
    expect(placed.fields.toCore[cellIndex(placed.grid, cell)]).toBe(Infinity);
    const refused = applyCommand(placed, { kind: "place", type: "antivirus", cell });
    expect(refused.towers).toBe(placed.towers);
    expect(refused.events.at(-1)).toEqual({ kind: "refused", reason: "occupied" });
    const poor = applyCommand({ ...start, bits: 10 }, { kind: "place", type: "antivirus", cell });
    expect(poor.events).toEqual([{ kind: "refused", reason: "notEnoughBits" }]);
  });

  it("upgrades twice, refuses the fourth version, and sells for seventy percent", () => {
    const placed = applyCommand(createMatch(options), { kind: "place", type: "antivirus", cell });
    const id = placed.towers[0]!.id;
    const twice = applyCommand(applyCommand(placed, { kind: "upgrade", towerId: id }), {
      kind: "upgrade",
      towerId: id,
    });
    expect(twice.towers[0]).toMatchObject({ version: 3, spent: 300 });
    expect(twice.bits).toBe(700);
    expect(twice.events.at(-1)).toEqual({ kind: "upgraded", towerId: id });
    const refused = applyCommand(twice, { kind: "upgrade", towerId: id });
    expect(refused.towers).toBe(twice.towers);
    expect(refused.events.at(-1)).toEqual({ kind: "refused", reason: "maxVersion" });
    const sold = applyCommand(refused, { kind: "sell", towerId: id });
    expect(sold.bits).toBe(910);
    expect(sold.towers).toEqual([]);
    expect(sold.grid.blocked[cellIndex(sold.grid, cell)]).toBe(0);
    expect(sold.events.at(-1)).toEqual({ kind: "sold", refund: 210 });
  });

  it("queues evenly spaced spawns, grants bits, and restarts to initial state", () => {
    let state = createMatch(options);
    state = applyCommand(state, { kind: "spawn", type: "worm", portId: "J1", count: 5 });
    expect(state.pendingSpawns).toEqual(
      [0, 24, 48, 72, 96].map((atTick) => ({ type: "worm", portId: "J1", atTick })),
    );
    const initialTowers = state.towers;
    state = applyCommand(state, { kind: "grantBits" });
    expect(state.bits).toBe(2000);
    expect(state.towers).toBe(initialTowers);
    expect(applyCommand(state, { kind: "restart" })).toEqual(createMatch(options));
  });

  it("recomputes dropped-file fields using the file's board cell", () => {
    const initial = createMatch(options);
    const files = initial.files.map((file) =>
      file.id === 0 ? { ...file, status: "dropped" as const, pos: { x: 260, y: 260 } } : file,
    );
    const updated = recomputeFields({ ...initial, files });
    expect(updated.fields.toFile[0]![cellIndex(updated.grid, cell)]).toBe(0);
    expect(Object.keys(updated.fields.toFile)).toEqual(["0"]);
    expect(updated.towers).toBe(initial.towers);
  });
});
