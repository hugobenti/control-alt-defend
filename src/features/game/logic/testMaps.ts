import type { ILevelMap } from "../level/level.type";

export const tinyMap: ILevelMap = {
  cols: 6,
  rows: 6,
  core: { c: 4, r: 4 },
  ports: [{ id: "P1", side: "left", start: 0 }],
  obstacles: [],
  traces: [],
};
