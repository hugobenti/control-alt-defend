import { cx } from "@/features/shared/utils/cx";

import { kbd } from "./Kbd.style";
import type { IKbdProps } from "./Kbd.type";

export function Kbd({ children, tone = "default", className }: IKbdProps) {
  return <kbd className={cx(kbd.base, kbd.tone[tone], className)}>{children}</kbd>;
}
