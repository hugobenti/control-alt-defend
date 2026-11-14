import { cx } from "@/features/shared/utils/cx";

import { Enemy } from "../Enemy/Enemy";
import { enemyArt } from "./EnemyArt.style";
import type { IEnemyArtProps } from "./EnemyArt.type";

/** An enemy drawn on its own, decorative: the text next to it names the enemy. */
export function EnemyArt({ type, className }: IEnemyArtProps) {
  return (
    <svg aria-hidden="true" viewBox="-20 -20 40 40" className={cx(enemyArt.base, className)}>
      <Enemy type={type} x={0} y={0} heading={0} health={1} bare />
    </svg>
  );
}
