import type { ReactNode } from "react";

export interface IPopoverProps {
  /** Accessible name of the dialog. */
  label: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}
