import type { ILevelMap } from "../level/level.type";
import type { IOutlineEdge } from "./boardOutline.type";
import { CELL, isVoidCell } from "./geometry";

/**
 * Walk the exposed cell edges with the playable surface on the right (clockwise on screen).
 * Every boundary becomes its own closed subpath: the outer edge runs clockwise and holes run
 * counter-clockwise, so the default nonzero fill rule leaves holes empty. Where two playable cells
 * touch only at a corner, the walk takes the sharpest right turn so each loop stays on its own cell.
 */
export function boardOutline(map: ILevelMap): string {
  const playable = (c: number, r: number) =>
    c >= 0 && c < map.cols && r >= 0 && r < map.rows && !isVoidCell({ c, r }, map);
  const outgoing = new Map<string, IOutlineEdge[]>();
  const add = (x: number, y: number, toX: number, toY: number) => {
    const key = `${x},${y}`;
    const list = outgoing.get(key) ?? [];
    list.push({ x, y, toX, toY });
    outgoing.set(key, list);
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

  const take = (key: string, from?: IOutlineEdge): IOutlineEdge | undefined => {
    const list = outgoing.get(key);
    if (!list || list.length === 0) return undefined;
    let index = 0;
    if (from && list.length > 1) {
      const dx = Math.sign(from.toX - from.x);
      const dy = Math.sign(from.toY - from.y);
      const turn = (edge: IOutlineEdge) =>
        dx * Math.sign(edge.toY - edge.y) - dy * Math.sign(edge.toX - edge.x);
      list.forEach((edge, i) => {
        if (turn(edge) > turn(list[index]!)) index = i;
      });
    }
    const [edge] = list.splice(index, 1);
    if (list.length === 0) outgoing.delete(key);
    return edge;
  };

  const loops: string[] = [];
  for (let start = outgoing.keys().next().value; start !== undefined;) {
    const points: [number, number][] = [];
    let edge = take(start);
    while (edge) {
      points.push([edge.x, edge.y]);
      const end = `${edge.toX},${edge.toY}`;
      edge = end === start ? undefined : take(end, edge);
    }
    loops.push(subpath(points));
    start = outgoing.keys().next().value;
  }
  return loops.join(" ");
}

/** Collapse a closed loop of unit steps into `M … H … V … Z`, emitting only the corners. */
function subpath(points: [number, number][]): string {
  const [first] = points;
  if (!first) return "";
  let path = `M${first[0]} ${first[1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i]!;
    const next = points[(i + 1) % points.length]!;
    const horizontal = points[i - 1]![1] === y;
    const continues = horizontal ? next[1] === y : next[0] === x;
    if (!continues) path += horizontal ? ` H${x}` : ` V${y}`;
  }
  return `${path} Z`;
}
