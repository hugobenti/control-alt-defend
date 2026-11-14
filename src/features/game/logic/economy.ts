import type { TTowerType, TVersion } from "../components/Tower/Tower.type";
import { balance } from "./balance.data";

export function buildCost(type: TTowerType): number {
  return balance.towers[type][1].cost;
}

export function upgradeCost(type: TTowerType, from: TVersion): number | null {
  if (from === 3) return null;
  return balance.towers[type][(from + 1) as TVersion].cost;
}

export function sellRefund(spent: number): number {
  return Math.floor(spent * balance.economy.sellRefund);
}
