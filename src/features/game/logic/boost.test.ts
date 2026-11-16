import { describe, expect, it } from "vitest";

import { boostEdges, boostFor, effectiveStats } from "./boost";
import type { ITowerState } from "./match.type";

function tower(
  id: number,
  type: ITowerState["type"],
  version: ITowerState["version"],
  c: number,
  r: number,
): ITowerState {
  return {
    id,
    type,
    version,
    c,
    r,
    spent: 0,
    cooldownTicks: 0,
    beamTargetId: null,
    beamTicks: 0,
    kills: 0,
    aimAt: null,
  };
}

describe("Firewall boosts", () => {
  const antivirus = tower(1, "antivirus", 1, 5, 5);
  const east = tower(2, "firewall", 2, 6, 5);

  it("boosts orthogonal attackers by the strongest adjacent version", () => {
    expect(boostFor([antivirus, east], antivirus)).toEqual({ version: 2, from: { c: 6, r: 5 } });
    expect(effectiveStats([antivirus, east], antivirus)).toMatchObject({ damage: 12.5, range: 3 });
    const north = tower(3, "firewall", 3, 5, 4);
    expect(boostFor([antivirus, east, north], antivirus)).toEqual({
      version: 3,
      from: { c: 5, r: 4 },
    });
    expect(effectiveStats([antivirus, east, north], antivirus)).toMatchObject({
      damage: 15,
      range: 4,
    });
  });

  it("breaks equal-version ties in east, south, west, north order", () => {
    expect(boostFor([tower(4, "firewall", 2, 5, 4), east], antivirus)).toEqual({
      version: 2,
      from: { c: 6, r: 5 },
    });
  });

  it("ignores version one, diagonal Firewalls, and Firewall recipients", () => {
    expect(boostFor([antivirus, tower(4, "firewall", 1, 6, 5)], antivirus)).toBeNull();
    expect(boostFor([antivirus, tower(4, "firewall", 3, 6, 6)], antivirus)).toBeNull();
    expect(boostFor([east, tower(5, "firewall", 3, 5, 5)], east)).toBeNull();
    expect(effectiveStats([east, tower(5, "firewall", 3, 5, 5)], east)).toMatchObject({
      damage: 0,
      range: 0,
    });
  });

  it("draws every orthogonal attacking connection in tower order", () => {
    const firewall = tower(1, "firewall", 3, 5, 6);
    const debuggerTower = tower(2, "debugger", 1, 4, 6);
    const antivirusTower = tower(3, "antivirus", 1, 6, 6);
    const diagonal = tower(4, "antivirus", 1, 6, 7);
    const inactive = tower(5, "firewall", 1, 7, 6);
    expect(boostEdges([firewall, debuggerTower, antivirusTower, diagonal, inactive])).toEqual([
      { from: { c: 5, r: 6 }, to: { c: 4, r: 6 } },
      { from: { c: 5, r: 6 }, to: { c: 6, r: 6 } },
    ]);
  });
});
