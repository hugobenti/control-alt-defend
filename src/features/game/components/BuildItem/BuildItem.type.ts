import type { TTowerType } from "../Tower/Tower.type";

type TBuildItemState = "available" | "placing" | "poor" | "locked";

export interface IBuildItemProps {
  type: TTowerType;
  cost: number;
  shortcut: string;
  state: TBuildItemState;
  /** Bits still missing; shown when `state` is `poor`. */
  missingBits?: number;
  onSelect?: () => void;
}
