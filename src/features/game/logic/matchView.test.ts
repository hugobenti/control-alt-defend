import { describe, expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { applyCommand, createMatch } from "./match";
import { buildBoardView, buildBuildItems, buildTowerCard } from "./matchView";

const initial = () => createMatch({ map: homePc, seed: 1, startBits: 1000, files: 8 });
const ui = { cursor: { c: 6, r: 6 }, placing: null, selectedTowerId: null };

describe("match view models", () => {
  it("maps hit enemy health and position without mutating simulation data", () => {
    const state = initial();
    const enemy = {
      id: 99,
      type: "worm" as const,
      small: false,
      pos: { x: 100, y: 140 },
      heading: 0,
      health: 15,
      maxHealth: 30,
      carrying: null,
      offset: { x: 0, y: 0 },
      hitUntilTick: 2,
      touchedEmptyCore: false,
    };
    const view = buildBoardView({ ...state, enemies: [enemy] }, ui);
    expect(view.enemies[0]).toMatchObject({
      id: 99,
      x: 100,
      y: 140,
      health: 0.5,
      hit: true,
      small: false,
      carrier: false,
    });
    expect(enemy.health).toBe(15);
  });

  it("passes the simulation tick and stable identity to each worm's visual pose", () => {
    const state = initial();
    const enemy = {
      id: 42,
      type: "worm" as const,
      small: false,
      pos: { x: 100, y: 140 },
      heading: 0,
      health: 30,
      maxHealth: 30,
      carrying: null,
      offset: { x: 0, y: 0 },
      hitUntilTick: 0,
      touchedEmptyCore: false,
    };
    const view = buildBoardView({ ...state, tick: 32, enemies: [enemy] }, ui);
    expect(view.enemies[0]).toMatchObject({ id: 42, motionTick: 32 });
    expect(buildBoardView({ ...state, tick: 32, enemies: [enemy] }, ui).enemies[0]).toEqual(
      view.enemies[0],
    );
  });

  it("uses the strongest adjacent Firewall boost for a selected attacking tower", () => {
    let state = initial();
    state = applyCommand(state, { kind: "place", type: "antivirus", cell: { c: 6, r: 6 } });
    state = applyCommand(state, { kind: "place", type: "firewall", cell: { c: 7, r: 6 } });
    const firewall = state.towers[1]!;
    state = { ...state, towers: [state.towers[0]!, { ...firewall, version: 3 }] };
    const view = buildBoardView(state, { ...ui, selectedTowerId: state.towers[0]!.id });
    expect(view.rangeRing?.range).toBe(4);
    expect(view.towers[0]).toMatchObject({ boosted: true, selected: true });
  });

  it("shows refusal reasons and previews only valid placement routes", () => {
    const state = initial();
    const invalid = buildBoardView(state, { ...ui, placing: "firewall", cursor: { c: 11, r: 7 } });
    expect(invalid.ghost).toMatchObject({
      valid: false,
      reason: "Can't build on ports, parts or the Core",
    });
    expect(invalid.routePreview).toEqual([]);
    const valid = buildBoardView(state, { ...ui, placing: "firewall" });
    expect(valid.ghost?.valid).toBe(true);
    expect(valid.routePreview).toHaveLength(2);
    expect(buildBoardView(state, ui).routePreview).toEqual([]);
  });

  it("shows the same refusal as the placement command for a small worm overlapping the cell", () => {
    const state = initial();
    const worm = {
      id: 99,
      type: "worm" as const,
      small: true,
      pos: { x: 284, y: 260 },
      heading: 0,
      health: 12,
      maxHealth: 12,
      carrying: null,
      offset: { x: 0, y: 0 },
      hitUntilTick: 0,
      touchedEmptyCore: false,
    };
    const occupied = { ...state, enemies: [worm] };
    const ghost = buildBoardView(occupied, { ...ui, placing: "firewall" }).ghost;
    const after = applyCommand(occupied, { kind: "place", type: "firewall", cell: ui.cursor });
    expect(ghost).toMatchObject({ valid: false, reason: "A virus is in the way" });
    expect(after.events.at(-1)).toEqual({ kind: "refused", reason: "overlapsEnemy" });
    expect(after.towers).toHaveLength(0);
  });

  it("derives affordable and selected build items", () => {
    const items = buildBuildItems({ ...initial(), bits: 50 }, "firewall");
    expect(items.find((item) => item.type === "antivirus")).toMatchObject({
      shortcut: "2",
      state: "poor",
      missingBits: 10,
    });
    expect(items.find((item) => item.type === "firewall")).toMatchObject({
      shortcut: "1",
      state: "placing",
    });
  });

  it("derives upgrade costs, refund and current/next stats", () => {
    const start = initial();
    const placed = applyCommand(start, { kind: "place", type: "antivirus", cell: ui.cursor });
    const tower = placed.towers[0]!;
    const card = buildTowerCard(placed, tower.id);
    expect(card?.upgrade).toMatchObject({ state: "available", cost: 90, nextVersion: 2 });
    expect(card?.sellRefund).toBe(42);
    expect(card?.stats).toContainEqual({ label: "Damage", value: "10", next: "16" });
    expect(
      buildTowerCard({ ...placed, towers: [{ ...tower, version: 3 }] }, tower.id)?.upgrade.state,
    ).toBe("max");
  });
  it("counts only towers actually boosted by this Firewall when a stronger neighbor competes", () => {
    let state = initial();
    state = applyCommand(state, { kind: "place", type: "firewall", cell: { c: 5, r: 6 } });
    state = applyCommand(state, { kind: "place", type: "antivirus", cell: { c: 6, r: 6 } });
    state = applyCommand(state, { kind: "place", type: "firewall", cell: { c: 7, r: 6 } });
    const [weak, antivirus, strong] = state.towers;
    state = {
      ...state,
      towers: [{ ...weak!, version: 2 }, antivirus!, { ...strong!, version: 3 }],
    };
    expect(buildTowerCard(state, weak!.id)?.stats).toContainEqual({
      label: "Boosting",
      value: "0 towers",
    });
    expect(buildTowerCard(state, strong!.id)?.stats).toContainEqual({
      label: "Boosting",
      value: "1 tower",
    });
  });

  it("renders a chained beam only during the pulse that contains chainTo", () => {
    const beam = {
      from: { x: 20, y: 20 },
      to: { x: 60, y: 20 },
      ramp: 1,
      chainTo: { x: 100, y: 20 },
    };
    expect(buildBoardView({ ...initial(), beams: [beam] }, ui).beams).toEqual([
      { from: beam.from, to: beam.to, ramp: 1 },
      { from: beam.to, to: beam.chainTo, ramp: 1 },
    ]);
    expect(
      buildBoardView({ ...initial(), beams: [{ ...beam, chainTo: null }] }, ui).beams,
    ).toHaveLength(1);
  });
  it.each([
    ["firewall", "boosts neighbours' damage by 25%.", "boosts neighbours' damage and range."],
    [
      "antivirus",
      "increases damage, fire rate and range.",
      "adds piercing: each shot also hits the virus behind.",
    ],
    [
      "debugger",
      "increases beam damage and range.",
      "the beam chains to one nearby virus at half damage.",
    ],
  ] as const)("describes both upgrade tiers accurately for %s", (type, v2Adds, v3Adds) => {
    const placed = applyCommand(initial(), { kind: "place", type, cell: ui.cursor });
    const tower = placed.towers[0]!;
    expect(buildTowerCard(placed, tower.id)?.upgrade).toMatchObject({
      nextVersion: 2,
      adds: v2Adds,
    });
    const upgraded = { ...placed, towers: [{ ...tower, version: 2 as const }] };
    expect(buildTowerCard(upgraded, tower.id)?.upgrade).toMatchObject({
      nextVersion: 3,
      adds: v3Adds,
    });
  });
});
