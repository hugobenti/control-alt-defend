import { Icon } from "@/features/shared/components/Icon/Icon";
import { cx } from "@/features/shared/utils/cx";

import { iconButton } from "./IconButton.style";
import type { IIconButtonProps } from "./IconButton.type";

export function IconButton({
  icon,
  label,
  pressed,
  expanded,
  controls,
  onClick,
  className,
}: IIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      aria-expanded={expanded}
      aria-controls={controls}
      className={cx(iconButton.base, pressed && iconButton.pressed, className)}
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  );
}
