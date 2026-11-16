import type { TEnemyType } from "../Enemy/Enemy.type";

export type TSpawnCount = "1" | "5";

export interface ISandboxControlsProps {
  port: string;
  ports: { value: string; text: string }[];
  count: TSpawnCount;
  onPortChange: (port: string) => void;
  onCountChange: (count: TSpawnCount) => void;
  onSpawn: (type: TEnemyType) => void;
  onGrantBits: () => void;
}
