import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { createMatch } from "./match";
import type { IMatchState } from "./match.type";
import { runTicks, step } from "./step";

const base = () => createMatch({ map: homePc, seed: 7, startBits: 1000, files: 8 });

describe("simulation ticks", () => {
  it("clears previous events and expired shots while advancing exactly one tick", () => {
    const state = base();
    const next = step({
      ...state,
      events: [{ kind: "dropped" }],
      shots: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, untilTick: 0 }],
    });
    expect(next.events).toEqual([]);
    expect(next.shots).toEqual([]);
    expect(next.tick).toBe(1);
    expect(state.tick).toBe(0);
  });

  it("ends the game on the same tick the final carrier leaks", () => {
    const state = base();
    const files = state.files.map((file) =>
      file.id === 0
        ? { ...file, status: "carried" as const, carrierId: 10 }
        : { ...file, status: "leaked" as const },
    );
    const enemy = {
      id: 10,
      type: "worm" as const,
      small: false,
      pos: { x: 930, y: 500 },
      heading: 0,
      health: 30,
      maxHealth: 30,
      carrying: 0,
      offset: { x: 0, y: 0 },
      hitUntilTick: 0,
      touchedEmptyCore: false,
      goal: "exit" as const,
    };
    let result: IMatchState = { ...state, files, enemies: [enemy] };
    for (let i = 0; i < 10 && result.files[0]!.status === "carried"; i++) result = step(result);
    expect(result.files[0]!.status).toBe("leaked");
    expect(result.status).toBe("over");
    expect(result.events).toContainEqual({ kind: "leaked", leaked: 8, total: 8 });
    expect(result.events).toContainEqual({ kind: "gameOver" });
  });

  it("does not progress a finished game except to clear its events", () => {
    const state = { ...base(), status: "over" as const, events: [{ kind: "gameOver" as const }] };
    expect(step(state)).toEqual({ ...state, events: [] });
    expect(state.events).toEqual([{ kind: "gameOver" }]);
  });

  it("returns the identical state for zero ticks", () => {
    const state = base();
    expect(runTicks(state, 0)).toBe(state);
  });
});
