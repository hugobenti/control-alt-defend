import { game } from "@/content/game";

import type { IBuildItemProps } from "../BuildItem/BuildItem.type";
import type { IEnemyProps } from "../Enemy/Enemy.type";
import type { IMatchHeaderProps } from "../MatchHeader/MatchHeader.type";
import type { ITowerCardProps } from "../TowerCard/TowerCard.type";
import type { ITowerProps } from "../Tower/Tower.type";

export const matchHeader = {
  level: { number: 1, name: game.screen.levelName },
  wave: { current: 7, total: 20 },
  nextWave: {
    phase: "break",
    preview: [
      { type: "worm", count: 6 },
      { type: "rootkit", count: 2 },
    ],
    secondsLeft: 12,
    earlyBonus: 6,
  },
  files: ["safe", "safe", "safe", "safe", "safe", "carried", "dropped", "leaked"],
  bits: 214,
  paused: false,
  speed: "1",
  defaultSpeed: "1",
  sound: true,
  settingsOpen: false,
} satisfies Omit<
  IMatchHeaderProps,
  | "onPausedChange"
  | "onSpeedChange"
  | "onSoundChange"
  | "onSettingsOpenChange"
  | "onDefaultSpeedChange"
  | "onStartNow"
  | "onRestart"
  | "onQuit"
>;

export const buildItems = [
  { type: "firewall", cost: 10, shortcut: "1", state: "available" },
  { type: "antivirus", cost: 40, shortcut: "2", state: "available" },
  { type: "debugger", cost: 90, shortcut: "3", state: "available" },
] satisfies IBuildItemProps[];

export const selectedTower = {
  type: "antivirus",
  version: 2,
  stats: [
    { label: "Damage", value: "12", next: "18" },
    { label: "Fire rate", value: "1.2 /s" },
    { label: "Range", value: "3.0", next: "3.5" },
    { label: "Firewall boost", value: "+20% damage", tone: "boost" },
    { label: "Targets", value: "Carriers first" },
    { label: "Kills", value: "23" },
  ],
  upgrade: {
    state: "available",
    cost: 120,
    nextVersion: 3,
    adds: "adds piercing: each shot also hits the virus behind.",
  },
  sellRefund: 84,
} satisfies Omit<ITowerCardProps, "onUpgrade" | "onSell">;

export const towers = [
  { type: "firewall", c: 3, r: 0, version: 1 },
  { type: "firewall", c: 3, r: 1, version: 1 },
  { type: "debugger", c: 3, r: 2, version: 1 },
  { type: "antivirus", c: 3, r: 3, version: 2, aimAt: { x: 90, y: 180 }, boosted: true },
  { type: "firewall", c: 3, r: 4, version: 2 },
  { type: "firewall", c: 0, r: 6, version: 1 },
  { type: "firewall", c: 1, r: 6, version: 1 },
  { type: "firewall", c: 2, r: 6, version: 1 },
  { type: "antivirus", c: 3, r: 6, version: 2, aimAt: { x: 210, y: 222 } },
  { type: "debugger", c: 4, r: 6, version: 2, boosted: true },
  { type: "firewall", c: 5, r: 6, version: 3 },
  { type: "antivirus", c: 6, r: 6, version: 1, aimAt: { x: 238, y: 216 }, boosted: true },
  {
    type: "antivirus",
    c: 7,
    r: 6,
    version: 2,
    aimAt: { x: 330, y: 222 },
    selected: true,
    boosted: true,
  },
  { type: "firewall", c: 8, r: 6, version: 2 },
  { type: "firewall", c: 15, r: 11, version: 1 },
  { type: "antivirus", c: 16, r: 11, version: 1, aimAt: { x: 700, y: 520 } },
  { type: "debugger", c: 17, r: 11, version: 3, boosted: true },
  { type: "firewall", c: 18, r: 11, version: 2 },
  { type: "antivirus", c: 19, r: 11, version: 3, aimAt: { x: 842, y: 520 }, boosted: true },
  { type: "firewall", c: 20, r: 11, version: 1 },
  { type: "firewall", c: 21, r: 11, version: 1 },
  { type: "antivirus", c: 22, r: 11, version: 2, aimAt: { x: 842, y: 520 } },
  { type: "firewall", c: 23, r: 11, version: 1 },
  { type: "debugger", c: 13, r: 9, version: 2, aimAt: { x: 580, y: 440 } },
  { type: "antivirus", c: 15, r: 8, version: 1, aimAt: { x: 580, y: 440 } },
] satisfies ITowerProps[];

export const boostEdges = [
  { from: { c: 3, r: 4 }, to: { c: 3, r: 3 } },
  { from: { c: 5, r: 6 }, to: { c: 4, r: 6 } },
  { from: { c: 5, r: 6 }, to: { c: 6, r: 6 } },
  { from: { c: 8, r: 6 }, to: { c: 7, r: 6 } },
  { from: { c: 18, r: 11 }, to: { c: 17, r: 11 } },
  { from: { c: 18, r: 11 }, to: { c: 19, r: 11 } },
];

export const enemies = [
  { type: "worm", x: 30, y: 140, heading: 0, health: 1 },
  { type: "worm", x: 90, y: 182, heading: 90, health: 0.8 },
  { type: "worm", x: 210, y: 222, heading: 0, health: 0.55, small: true },
  { type: "worm", x: 238, y: 214, heading: -8, health: 0.4, small: true },
  { type: "worm", x: 330, y: 222, heading: 0, health: 0.3, hit: true },
  { type: "rootkit", x: 580, y: 440, heading: -90, health: 0.62 },
  { type: "rootkit", x: 700, y: 520, heading: 180, health: 1 },
  { type: "worm", x: 842, y: 520, heading: 0, health: 0.6, carrier: true },
] satisfies IEnemyProps[];

export const shots = [
  { from: { x: 314, y: 242 }, to: { x: 330, y: 222 } },
  { from: { x: 820, y: 486 }, to: { x: 842, y: 520 } },
];

export const beams = [
  { from: { x: 540, y: 380 }, to: { x: 576, y: 438 }, ramp: 0.8 },
  { from: { x: 700, y: 460 }, to: { x: 704, y: 512 }, ramp: 0.25 },
];
