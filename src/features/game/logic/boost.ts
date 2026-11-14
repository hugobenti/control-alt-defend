import type { IBoostEdgeProps } from "../components/BoostEdge/BoostEdge.type";
import { balance } from "./balance.data";
import type { ITowerVersionStats } from "./balance.type";
import type { ICell } from "./grid.type";
import type { ITowerState } from "./match.type";

export function boostFor(
  towers: ITowerState[],
  tower: ITowerState,
): { version: 2 | 3; from: ICell } | null {
  if (tower.type === "firewall") return null;
  let strongest: { version: 2 | 3; from: ICell } | null = null;
  for (const [dc, dr] of [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ] as const) {
    const neighbor = towers.find(
      (candidate) =>
        candidate.type === "firewall" &&
        candidate.c === tower.c + dc &&
        candidate.r === tower.r + dr,
    );
    if (neighbor && neighbor.version >= 2 && (!strongest || neighbor.version > strongest.version)) {
      strongest = { version: neighbor.version as 2 | 3, from: { c: neighbor.c, r: neighbor.r } };
    }
  }
  return strongest;
}

export function effectiveStats(towers: ITowerState[], tower: ITowerState): ITowerVersionStats {
  const stats = balance.towers[tower.type][tower.version];
  const boost = boostFor(towers, tower);
  if (!boost) return stats;
  const factor = balance.boost[boost.version];
  return { ...stats, damage: stats.damage * factor.damage, range: stats.range + factor.range };
}

export function boostEdges(towers: ITowerState[]): IBoostEdgeProps[] {
  const edges: IBoostEdgeProps[] = [];
  for (const firewall of towers) {
    if (firewall.type !== "firewall" || firewall.version === 1) continue;
    for (const tower of towers) {
      if (
        tower.type !== "firewall" &&
        Math.abs(tower.c - firewall.c) + Math.abs(tower.r - firewall.r) === 1
      ) {
        edges.push({ from: { c: firewall.c, r: firewall.r }, to: { c: tower.c, r: tower.r } });
      }
    }
  }
  return edges;
}
