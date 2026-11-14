import type { TTowerType } from "../Tower/Tower.type";

export interface IPlacementGhostProps {
  type: TTowerType;
  c: number;
  r: number;
  valid: boolean;
  reason?: string;
}
