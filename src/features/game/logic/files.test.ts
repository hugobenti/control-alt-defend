import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { balance } from "./balance.data";
import { dropFile, fileStates, stepFiles } from "./files";
import { cellIndex, cellOf, discOverlapsCell } from "./grid";
import { applyCommand, createMatch } from "./match";
import type { IMatchState } from "./match.type";

const base = () => createMatch({ map: homePc, seed: 7, startBits: 1000, files: 8 });
function carrierAt(pos: { x: number; y: number }): IMatchState {
  const state = base();
  return {
    ...state,
    enemies: [
      {
        id: 10,
        type: "worm",
        small: false,
        pos,
        heading: 35,
        health: 30,
        maxHealth: 30,
        carrying: 0,
        offset: { x: 0, y: 0 },
        hitUntilTick: 0,
        touchedEmptyCore: false,
        goal: "exit",
      },
    ],
    files: state.files.map((file) =>
      file.id === 0 ? { ...file, status: "carried", carrierId: 10 } : file,
    ),
  };
}

describe("files", () => {
  it("drops a carried file in place and immediately creates its route field", () => {
    const state = carrierAt({ x: 300, y: 260 });
    const result = dropFile(state, state.enemies[0]!);
    expect(result.files[0]).toMatchObject({
      status: "dropped",
      pos: { x: 300, y: 260 },
      carrierId: null,
      heading: 35,
    });
    expect(result.fields.toFile[0]).toBeDefined();
    expect(result.events).toContainEqual({ kind: "dropped" });
    expect(state.files[0]!.status).toBe("carried");
  });

  it("drifts 32 units along the return route in a second", () => {
    let state = dropFile(carrierAt({ x: 100, y: 300 }), carrierAt({ x: 100, y: 300 }).enemies[0]!);
    let distance = 0;
    for (let i = 0; i < 60; i++) {
      const before = state.files[0]!.pos!;
      state = stepFiles(state);
      const after = state.files[0]!.pos!;
      distance += Math.hypot(after.x - before.x, after.y - before.y);
    }
    expect(distance).toBeGreaterThanOrEqual(31);
    expect(distance).toBeLessThanOrEqual(33);
  });

  it("keeps the pickup route centered on a drifting file after it crosses a cell", () => {
    const carrier = carrierAt({ x: 100, y: 300 });
    let state = dropFile(carrier, carrier.enemies[0]!);
    const initialCell = cellOf(state.files[0]!.pos!);
    for (let i = 0; i < 90; i++) state = stepFiles(state);
    const currentCell = cellOf(state.files[0]!.pos!);
    expect(currentCell).not.toEqual(initialCell);
    expect(state.fields.toFile[0]![cellIndex(state.grid, currentCell)]).toBe(0);
  });

  it("rejoins the core, removes the obsolete field, and announces recovery", () => {
    const carrier = carrierAt({ x: 300, y: 260 });
    let state = dropFile(carrier, carrier.enemies[0]!);
    for (let i = 0; i < 60 * 20 && state.files[0]!.status === "dropped"; i++)
      state = stepFiles(state);
    expect(state.files[0]).toMatchObject({ status: "core", pos: null });
    expect(state.fields.toFile[0]).toBeUndefined();
    expect(state.events).toContainEqual({ kind: "recovered", filesInCore: 8 });
  });

  it("routes around a firewall wall without overlapping any blocked cell", () => {
    let state = base();
    for (let r = 5; r <= 9; r++) {
      state = applyCommand(state, { kind: "place", type: "firewall", cell: { c: 7, r } });
      expect(state.events.at(-1)?.kind).toBe("placed");
    }
    const carrier = carrierAt({ x: 100, y: 300 });
    state = dropFile(
      { ...state, enemies: carrier.enemies, files: carrier.files },
      carrier.enemies[0]!,
    );
    for (let i = 0; i < 60 * 20 && state.files[0]!.status === "dropped"; i++) {
      state = stepFiles(state);
      if (state.files[0]!.status === "dropped")
        for (let r = 5; r <= 9; r++)
          expect(discOverlapsCell(state.files[0]!.pos!, balance.files.radius, { c: 7, r })).toBe(
            false,
          );
    }
    expect(state.files[0]!.status).toBe("core");
  });

  it("maps internal file states to HUD states in file id order", () => {
    const state = base();
    const files = [
      { ...state.files[3]!, status: "leaked" as const },
      { ...state.files[2]!, status: "dropped" as const },
      { ...state.files[0]!, status: "core" as const },
      { ...state.files[1]!, status: "carried" as const },
    ];
    expect(fileStates({ ...state, files })).toEqual(["safe", "carried", "dropped", "leaked"]);
  });
});
