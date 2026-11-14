import type { ReactNode } from "react";

import type { button } from "./Button.style";

export interface IButtonProps {
  variant?: keyof typeof button.variant;
  size?: keyof typeof button.size;
  children: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  /** Id of the element that explains the button (for example why it is disabled). */
  describedBy?: string;
  onClick?: () => void;
  className?: string;
}
