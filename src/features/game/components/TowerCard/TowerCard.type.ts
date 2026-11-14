import type { TTowerType, TVersion } from "../Tower/Tower.type";

type TUpgradeState = "available" | "poor" | "locked" | "max";

export interface ITowerCardStat {
  label: string;
  value: string;
  /** The value after the next upgrade, shown as a gain. */
  next?: string;
  /** `boost` colors the value as a Firewall boost. */
  tone?: "boost";
}

interface ITowerCardUpgrade {
  state: TUpgradeState;
  cost?: number;
  /** Bits still missing; shown when `state` is `poor`. */
  missingBits?: number;
  nextVersion?: TVersion;
  /** What the next version adds, one sentence. */
  adds?: string;
}

export interface ITowerCardProps {
  type: TTowerType;
  version: TVersion;
  stats: ITowerCardStat[];
  upgrade: ITowerCardUpgrade;
  sellRefund: number;
  onUpgrade?: () => void;
  onSell?: () => void;
}
