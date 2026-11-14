import { cx } from "@/features/shared/utils/cx";

import { stat } from "./Stat.style";
import type { IStatProps } from "./Stat.type";
import { useStat } from "./useStat";

export function Stat({ label, value, total, className }: IStatProps) {
  const { totalText } = useStat({ total });
  return (
    <div className={cx(stat.base, className)}>
      <span className={stat.label}>{label}</span>
      <span className={stat.value}>
        {value}
        {totalText !== undefined && <span className={stat.total}> {totalText}</span>}
      </span>
    </div>
  );
}
