import type { TIconName } from "@/features/shared/components/Icon/Icon.type";

export interface IIconButtonProps {
  icon: TIconName;
  /** Accessible name. */
  label: string;
  /** Toggle state (aria-pressed). */
  pressed?: boolean;
  /** Open state of the popup the button controls (aria-expanded). */
  expanded?: boolean;
  /** Id of the popup the button controls (aria-controls). */
  controls?: string;
  onClick?: () => void;
  className?: string;
}
