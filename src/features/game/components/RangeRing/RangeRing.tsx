import { game } from "@/content/game";
import { cx } from "@/features/shared/utils/cx";

import { rangeRing as styles } from "./RangeRing.style";
import type { IRangeRingProps } from "./RangeRing.type";
import { useRangeRing } from "./useRangeRing";

export function RangeRing(props: IRangeRingProps) {
  const { cx: x, cy: y, radius } = useRangeRing(props);
  return (
    <circle
      role="img"
      aria-label={game.range(props.type)}
      cx={x}
      cy={y}
      r={radius}
      className={cx(styles.base, styles.type[props.type])}
    />
  );
}
