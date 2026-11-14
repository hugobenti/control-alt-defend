import type { TIconName } from "@/features/shared/components/Icon/Icon.type";

export interface IIconButtonProps {
  icon: TIconName;
  /** Accessible name. */
  label: string;
  pressed?: boolean;
  onClick?: () => void;
  className?: string;
}
