/** Site-wide identity, used by metadata, the manifest, robots, the sitemap and generated images. */
export interface ISiteContent {
  name: string;
  description: string;
  /** Production origin, no trailing slash. */
  url: string;
  author: string;
  /** `<html lang>`. */
  lang: string;
  /** The letter drawn on the generated app icons and social image. */
  monogram: string;
}

/** Copy for the home page. */
export interface IHomeContent {
  h1: string;
  lead: string;
}

/** Copy for the 404 page. */
export interface IStatusPagesContent {
  notFound: { metaTitle: string; h1: string; text: string; home: string };
}

import type { TEnemyType } from "../features/game/components/Enemy/Enemy.type";

import type { TTowerType } from "../features/game/components/Tower/Tower.type";
import type { TPlacementRefusal } from "../features/game/logic/placement.type";

/** Board labels and the names of rendered game pieces. */
export interface IGameContent {
  board: string;
  cursor: (c: number, r: number) => string;
  gameOver: { title: string; text: (files: number) => string; restart: string };
  screen: { build: string; selected: string; levelName: string };
  sandbox: {
    title: string;
    status: string;
    viruses: string;
    controls: string;
    spawnAt: string;
    count: string;
    spawn: Record<TEnemyType, string>;
    grantBits: string;
    keys: Record<TEnemyType | "bits", string>;
  };
  coreLabel: string;
  core: (filesInCore: number, files: number) => string;
  port: (label: string) => string;
  file: Record<"inCore" | "dropped", string>;
  towerNames: Record<"firewall" | "antivirus" | "debugger", string>;
  towerRoles: Record<"firewall" | "antivirus" | "debugger", string>;
  towerState: { selected: string; boosted: string };
  tower: (
    type: "firewall" | "antivirus" | "debugger",
    version: 1 | 2 | 3,
    boosted: boolean,
    selected: boolean,
  ) => string;
  range: (type: "firewall" | "antivirus" | "debugger") => string;
  boostEdge: string;
  enemyNames: Record<"worm" | "rootkit", string>;
  enemyState: Record<"carrier" | "armored" | "health", string>;
  enemy: (type: "worm" | "rootkit", healthPercent: number, carrier: boolean) => string;
  placement: { valid: string; invalid: string; reasons: Record<TPlacementRefusal, string> };
  needBits: (missingBits: number) => string;
  build: {
    placingHint: string;
    lockedReason: string;
    cost: (bits: number) => string;
  };
  card: {
    stats: Record<
      | "damage"
      | "fireRate"
      | "pulse"
      | "range"
      | "targets"
      | "kills"
      | "boostNone"
      | "boostV2"
      | "boostV3",
      string
    >;
    targetsValue: string;
    addsV2: Record<TTowerType, string>;
    adds: Record<TTowerType, string>;
    perSecond: (n: number) => string;
    pulseValue: (damage: number, pulses: number) => string;
    upgradeTo: (version: number) => string;
    withCost: (label: string, bits: number) => string;
    locked: (version: number) => string;
    lockedHint: string;
    max: string;
    sell: string;
    upgradeKey: string;
    sellKey: string;
    sellRefund: (bits: number) => string;
    boost: string;
    boostOwn: string;
    boostingLabel: string;
    boosting: (towers: number) => string;
    version: (version: number) => string;
    next: (value: string) => string;
  };
  files: {
    summary: (counts: Record<"safe" | "carried" | "dropped" | "leaked", number>) => string;
  };
  header: {
    label: string;
    brand: { name: string; parts: [string, string, string]; separator: string };
    level: (number: number) => string;
    paused: string;
    wave: string;
    files: string;
    bits: string;
    next: {
      label: string;
      in: (time: string) => string;
      startNow: string;
      startKey: string;
      earlyBonus: (bits: number) => string;
      running: (wave: number) => string;
      virusesLeft: (count: number) => string;
      times: (count: number) => string;
      chip: (type: "worm" | "rootkit", count: number) => string;
    };
    controls: {
      pause: string;
      resume: string;
      speed: string;
      speeds: Record<"1" | "2", string>;
      sound: string;
      settings: string;
    };
    settings: {
      title: string;
      sound: string;
      defaultSpeed: string;
      restart: string;
      quit: string;
    };
  };
}
