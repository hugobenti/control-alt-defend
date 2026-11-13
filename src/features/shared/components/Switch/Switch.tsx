import { cx } from "@/features/shared/utils/cx";

import { switchStyle } from "./Switch.style";
import type { ISwitchProps } from "./Switch.type";
import { useSwitch } from "./useSwitch";

export function Switch({ label, checked, onChange, className }: ISwitchProps) {
  const { toggle } = useSwitch({ checked, onChange });
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cx(
        switchStyle.base,
        checked ? switchStyle.checked : switchStyle.unchecked,
        className,
      )}
      onClick={toggle}
    >
      <span
        aria-hidden="true"
        className={cx(
          switchStyle.knob,
          checked ? switchStyle.knobChecked : switchStyle.knobUnchecked,
        )}
      />
    </button>
  );
}
