export type TEnemyType = "worm" | "rootkit";

export interface IEnemyProps {
  type: TEnemyType;
  /** Position of the enemy's centre, in board SVG units. */
  x: number;
  y: number;
  /** Direction of travel in degrees; 0 faces right. */
  heading: number;
  /** Remaining health, 0 to 1. */
  health: number;
  small?: boolean;
  carrier?: boolean;
  hit?: boolean;
  /** Draws the body only, without the health bar or armor marker (for icons). */
  bare?: boolean;
}

export type TEnemyLayerKind = "ghostShift" | "ghostLight" | "main";
