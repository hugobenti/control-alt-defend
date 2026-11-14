import { cx } from "@/features/shared/utils/cx";

import { segmentedControl } from "./SegmentedControl.style";
import type { ISegmentedControlProps } from "./SegmentedControl.type";

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: ISegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className={cx(segmentedControl.base, className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          className={cx(
            segmentedControl.option,
            option.value === value ? segmentedControl.selected : segmentedControl.unselected,
          )}
          onClick={() => onChange(option.value)}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
}
