import { cx } from "@/features/shared/utils/cx";

import { popover } from "./Popover.style";
import type { IPopoverProps } from "./Popover.type";
import { usePopover } from "./usePopover";

export function Popover({ id, label, open, onClose, children, className }: IPopoverProps) {
  const { ref } = usePopover({ open, onClose });
  if (!open) return null;
  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      className={cx(popover.base, className)}
    >
      {children}
    </div>
  );
}
