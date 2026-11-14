import type { IGameContent } from "./content.type";

export const game: IGameContent = {
  board: "Home PC board",
  coreLabel: "CORE",
  core: (filesInCore, files) => `Core, ${filesInCore} of ${files} files`,
  port: (label) => `${label} PORT`,
  obstacle: { chip: "Chip", capacitor: "Capacitor", resistor: "Resistor", crystal: "Crystal" },
  file: { inCore: "File in core", dropped: "Dropped file drifting home" },
};
