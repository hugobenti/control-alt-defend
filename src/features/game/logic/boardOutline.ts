import type { ILevelMap } from "../level/level.type";
import { CELL, isVoidCell } from "./geometry";

/** Walk the exposed cell edges clockwise to obtain the playable surface boundary. */
export function boardOutline(map: ILevelMap): string {
  const edges = new Map<string, { x: number; y: number; direction: "H" | "V" }>();
  const playable = (c: number, r: number) =>
    c >= 0 && c < map.cols && r >= 0 && r < map.rows && !isVoidCell({ c, r }, map);
  const add = (x: number, y: number, endX: number, endY: number) => {
    edges.set(`${x},${y}`, { x: endX, y: endY, direction: x === endX ? "V" : "H" });
  };
  for (let r = 0; r < map.rows; r++) {
    for (let c = 0; c < map.cols; c++) {
      if (!playable(c, r)) continue;
      const x = c * CELL;
      const y = r * CELL;
      if (!playable(c, r - 1)) add(x, y, x + CELL, y);
      if (!playable(c + 1, r)) add(x + CELL, y, x + CELL, y + CELL);
      if (!playable(c, r + 1)) add(x + CELL, y + CELL, x, y + CELL);
      if (!playable(c - 1, r)) add(x, y + CELL, x, y);
    }
  }

  const start = edges.keys().next().value;
  if (start === undefined) return "";
  const [startX, startY] = start.split(",").map(Number);
  let path = `M${startX} ${startY}`;
  let key = start;
  let previous: "H" | "V" | null = null;
  let endX = startX;
  let endY = startY;
  while (edges.has(key)) {
    const edge = edges.get(key)!;
    edges.delete(key);
    if (previous !== null && previous !== edge.direction) {
      path += previous === "H" ? ` H${endX}` : ` V${endY}`;
    }
    previous = edge.direction;
    endX = edge.x;
    endY = edge.y;
    key = `${endX},${endY}`;
  }
  if (previous !== null && (endX !== startX || endY !== startY)) {
    path += previous === "H" ? ` H${endX}` : ` V${endY}`;
  }
  return `${path} Z`;
}
