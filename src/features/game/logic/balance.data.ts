import type { IBalance } from "./balance.type";

export const TICK_S = 1 / 60;

export const balance: IBalance = {
  towers: {
    firewall: {
      1: { cost: 20, damage: 0, rate: 0, range: 0 },
      2: { cost: 30, damage: 0, rate: 0, range: 0 },
      3: { cost: 50, damage: 0, rate: 0, range: 0 },
    },
    antivirus: {
      1: { cost: 60, damage: 10, rate: 2, range: 3 },
      2: { cost: 90, damage: 16, rate: 2.5, range: 3.25 },
      3: { cost: 150, damage: 22, rate: 3, range: 3.5 },
      pierceReach: 1.5,
    },
    debugger: {
      1: { cost: 120, damage: 8, rate: 4, range: 2.5 },
      2: { cost: 180, damage: 12, rate: 4, range: 2.75 },
      3: { cost: 300, damage: 16, rate: 4, range: 3 },
      chainReach: 2,
      chainFactor: 0.5,
      rampSeconds: 3,
      rampMax: 3,
    },
  },
  boost: { 2: { damage: 1.25, range: 0 }, 3: { damage: 1.5, range: 1 } },
  enemies: {
    worm: { health: 30, speed: 2.4, radius: 10, armor: 0, reward: 8 },
    wormSmall: { health: 12, speed: 2.8, radius: 7, armor: 0, reward: 3 },
    rootkit: { health: 320, speed: 1, radius: 12, armor: 6, reward: 40 },
  },
  files: { driftSpeed: 0.8, radius: 6, count: 8 },
  movement: {
    turnRateDeg: 540,
    arrive: 2,
    lookaheadCells: 8,
    offsetMax: 8,
    splitOffset: 10,
    shotTicks: 6,
    hitTicks: 8,
  },
  economy: { sellRefund: 0.7, startBits: 1000, grantBits: 1000 },
  sandbox: { groupSpacingS: 0.4 },
};
