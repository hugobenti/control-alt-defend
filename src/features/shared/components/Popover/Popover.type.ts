import type { ReactNode } from "react";

export interface IPopoverProps {
  /** Accessible name of the dialog. */
  label: string;
  id?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}
