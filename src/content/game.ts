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
  placement: { valid: "Valid placement", invalid: "Refused placement" },
};
