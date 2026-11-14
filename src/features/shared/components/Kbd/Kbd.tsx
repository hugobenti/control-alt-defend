import { cx } from "@/features/shared/utils/cx";

import { kbd } from "./Kbd.style";
import type { IKbdProps } from "./Kbd.type";

export function Kbd({ children, inherit, className }: IKbdProps) {
  return <kbd className={cx(kbd.base, inherit && kbd.inherit, className)}>{children}</kbd>;
}
