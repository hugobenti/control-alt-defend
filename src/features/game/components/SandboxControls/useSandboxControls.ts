import { game } from "@/content/game";

import type { ISandboxControlsProps, TSpawnCount } from "./SandboxControls.type";

const counts: { value: TSpawnCount; text: string }[] = [
  { value: "1", text: "1" },
  { value: "5", text: "5" },
];

export function useSandboxControls({ onSpawn }: ISandboxControlsProps) {
  return {
    ...game.sandbox,
    counts,
    spawnWorm: () => onSpawn("worm"),
    spawnRootkit: () => onSpawn("rootkit"),
  };
}
