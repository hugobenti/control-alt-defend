import { balance } from "./balance.data";
import type { IEnemyStats } from "./balance.type";
import type { IEnemyState } from "./match.type";

export function enemyStats(enemy: IEnemyState): IEnemyStats {
  return enemy.type === "worm" && enemy.small
    ? balance.enemies.wormSmall
    : balance.enemies[enemy.type];
}
