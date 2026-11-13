import { cx } from "@/features/shared/utils/cx";

import { pill } from "./Pill.style";
import type { IPillProps } from "./Pill.type";

export function Pill({ children, className }: IPillProps) {
  return <span className={cx(pill.base, className)}>{children}</span>;
}
