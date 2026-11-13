import { cx } from "@/features/shared/utils/cx";

import { iconPaths } from "./Icon.data";
import { icon } from "./Icon.style";
import type { IIconProps } from "./Icon.type";

export function Icon({ name, className }: IIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cx(icon.base, className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={iconPaths[name].d}
        fill={iconPaths[name].fill}
        stroke={iconPaths[name].fill ? "none" : undefined}
      />
      {name === "gear" && <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}
