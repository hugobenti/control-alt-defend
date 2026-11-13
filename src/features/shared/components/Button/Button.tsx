import { Kbd } from "@/features/shared/components/Kbd/Kbd";
import { cx } from "@/features/shared/utils/cx";

import { button } from "./Button.style";
import type { IButtonProps } from "./Button.type";

export function Button({
  variant = "primary",
  size = "sm",
  children,
  shortcut,
  disabled,
  describedBy,
  onClick,
  className,
}: IButtonProps) {
  return (
    <button
      type="button"
      className={cx(button.base, button.variant[variant], button.size[size], className)}
      disabled={disabled}
      aria-describedby={describedBy}
      onClick={onClick}
    >
      {children}
      {shortcut !== undefined && <Kbd inherit={variant === "primary"}>{shortcut}</Kbd>}
    </button>
  );
}
