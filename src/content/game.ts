import type { IGameContent } from "./content.type";

export const game: IGameContent = {
  board: "Home PC board",
  coreLabel: "CORE",
  core: (filesInCore, files) => `Core, ${filesInCore} of ${files} files`,
  port: (label) => `${label} PORT`,
  file: { inCore: "File in core", dropped: "Dropped file drifting home" },
  towerNames: { firewall: "Firewall", antivirus: "Antivirus", debugger: "Debugger" },
  towerRoles: {
    firewall: "Wall; boosts towers next to it",
    antivirus: "Fast single shots",
    debugger: "Ramping beam, beats armor",
  },
  towerState: { selected: "selected", boosted: "boosted", version: "version" },
  tower: (type, version, boosted, selected) =>
    `${game.towerNames[type]} v${version}.0${boosted ? `, ${game.towerState.boosted}` : ""}${selected ? `, ${game.towerState.selected}` : ""}`,
  range: (type) => `${game.towerNames[type]} range`,
  boostEdge: "Firewall boost connection",
  shot: "Antivirus shot",
  beam: "Debugger beam",
  enemyNames: { worm: "Worm", rootkit: "Rootkit" },
  enemyState: { carrier: "carrying a file", armored: "armored", health: "health" },
  enemy: (type, healthPercent, carrier) =>
    `${game.enemyNames[type]}, ${healthPercent}% ${game.enemyState.health}${type === "rootkit" ? `, ${game.enemyState.armored}` : ""}${carrier ? `, ${game.enemyState.carrier}` : ""}`,
  placement: { valid: "Valid placement", invalid: "Refused placement" },
  build: {
    placingHint: "Click a cell · Esc cancels",
    lockedReason: "Unlock in the Upgrade lab",
    needBits: (missingBits) => `Need ${missingBits} more bits`,
    cost: (bits) => `${bits} bits`,
  },
  card: {
    upgradeTo: (version) => `Upgrade to v${version}.0`,
    withCost: (label, bits) => `${label} · ${bits}`,
    needBits: (missingBits) => `Need ${missingBits} more bits`,
    locked: (version) => `v${version}.0 is locked.`,
    lockedHint: "Unlock it in the Upgrade lab between levels.",
    max: "Max version reached.",
    sell: "Sell",
    upgradeKey: "U",
    sellKey: "S",
    sellRefund: (bits) => `+${bits}`,
    boost: "Firewall boost",
    boosting: (towers) => `Boosting ${towers} towers`,
    version: (version) => `v${version}.0`,
    next: (value) => `→ ${value}`,
  },
};
