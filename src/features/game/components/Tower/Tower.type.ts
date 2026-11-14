export type TTowerType = "firewall" | "antivirus" | "debugger";
export type TVersion = 1 | 2 | 3;

export interface ITowerProps {
  type: TTowerType;
  version: TVersion;
  c: number;
  r: number;
  aimAt?: { x: number; y: number };
  selected?: boolean;
  boosted?: boolean;
}
