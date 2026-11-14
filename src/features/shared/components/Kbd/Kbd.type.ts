import type { ReactNode } from "react";

export interface IKbdProps {
  children: ReactNode;
  /** Take the colors of the surrounding text (inside a filled button). */
  inherit?: boolean;
  className?: string;
}
