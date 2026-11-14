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

/** Board labels and the names of rendered game pieces. */
export interface IGameContent {
  board: string;
  coreLabel: string;
  core: (filesInCore: number, files: number) => string;
  port: (label: string) => string;
  file: Record<"inCore" | "dropped", string>;
  towerNames: Record<"firewall" | "antivirus" | "debugger", string>;
  towerRoles: Record<"firewall" | "antivirus" | "debugger", string>;
  towerState: { selected: string; boosted: string; version: string };
  tower: (
    type: "firewall" | "antivirus" | "debugger",
    version: 1 | 2 | 3,
    boosted: boolean,
    selected: boolean,
  ) => string;
  range: (type: "firewall" | "antivirus" | "debugger") => string;
  boostEdge: string;
  shot: string;
  beam: string;
  enemyNames: Record<"worm" | "rootkit", string>;
  enemyState: Record<"carrier" | "armored" | "health", string>;
  enemy: (type: "worm" | "rootkit", healthPercent: number, carrier: boolean) => string;
  placement: { valid: string; invalid: string };
  build: {
    placingHint: string;
    lockedReason: string;
    needBits: (missingBits: number) => string;
    cost: (bits: number) => string;
  };
  card: {
    upgradeTo: (version: number) => string;
    withCost: (label: string, bits: number) => string;
    needBits: (missingBits: number) => string;
    locked: (version: number) => string;
    lockedHint: string;
    max: string;
    sell: string;
    upgradeKey: string;
    sellKey: string;
    sellRefund: (bits: number) => string;
    boost: string;
    boosting: (towers: number) => string;
    version: (version: number) => string;
    next: (value: string) => string;
  };
}
