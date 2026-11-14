import type { ReactNode } from "react";

import type { kbd } from "./Kbd.style";

export interface IKbdProps {
  children: ReactNode;
  /** `onAccent` reads on a filled accent button. */
  tone?: keyof typeof kbd.tone;
  className?: string;
}
