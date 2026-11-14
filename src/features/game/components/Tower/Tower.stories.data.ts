import type { ILevelMap } from "../../level/level.type";

export const towerStoryMap: ILevelMap = {
  cols: 12,
  rows: 6,
  core: { c: 10, r: 2 },
  ports: [
    { id: "J1", side: "left", start: 2 },
    { id: "J2", side: "right", start: 2 },
  ],
  obstacles: [],
  traces: [],
};
