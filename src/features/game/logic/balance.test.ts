import { describe, expect, it } from "vitest";

import { balance, TICK_S } from "./balance.data";
import type { IEnemyStats, ITowerVersionStats } from "./balance.type";

describe("sandbox balance", () => {
  it("stores prices, damage, rate and range per purchased tower version", () => {
    const firewallV1: ITowerVersionStats = balance.towers.firewall[1];
    expect(firewallV1.cost).toBe(20);
    expect(balance.towers.firewall).toMatchObject({
      1: { cost: 20, damage: 0, rate: 0, range: 0 },
      2: { cost: 30, damage: 0, rate: 0, range: 0 },
      3: { cost: 50, damage: 0, rate: 0, range: 0 },
    });
    expect(balance.towers.antivirus).toMatchObject({
      1: { cost: 60, damage: 10, rate: 2, range: 3 },
      2: { cost: 90, damage: 16, rate: 2.5, range: 3.25 },
      3: { cost: 150, damage: 22, rate: 3, range: 3.5 },
      pierceReach: 1.5,
    });
    expect(balance.towers.debugger).toMatchObject({
      1: { cost: 120, damage: 8, rate: 4, range: 2.5 },
      2: { cost: 180, damage: 12, rate: 4, range: 2.75 },
      3: { cost: 300, damage: 16, rate: 4, range: 3 },
      chainReach: 2,
      chainFactor: 0.5,
      rampSeconds: 3,
      rampMax: 3,
    });
    expect(balance.boost).toEqual({ 2: { damage: 1.25, range: 0 }, 3: { damage: 1.5, range: 1 } });
  });

  it("stores enemy, movement, file and economy constants", () => {
    const worm: IEnemyStats = balance.enemies.worm;
    expect(worm.reward).toBe(8);
    expect(TICK_S).toBe(1 / 60);
    expect(balance.enemies).toEqual({
      worm: { health: 30, speed: 2.4, radius: 10, armor: 0, reward: 8 },
      wormSmall: { health: 12, speed: 2.8, radius: 7, armor: 0, reward: 3 },
      rootkit: { health: 320, speed: 1, radius: 12, armor: 6, reward: 40 },
    });
    expect(balance.files).toEqual({ driftSpeed: 0.8, radius: 6, count: 8 });
    expect(balance.movement).toEqual({
      turnRateDeg: 540,
      arrive: 2,
      lookaheadCells: 8,
      offsetMax: 8,
      splitOffset: 10,
      shotTicks: 6,
      hitTicks: 8,
    });
    expect(balance.economy).toEqual({ sellRefund: 0.7, startBits: 1000, grantBits: 1000 });
    expect(balance.sandbox).toEqual({ groupSpacingS: 0.4 });
  });
});
