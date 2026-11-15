import { game } from "@/content/game";

import type { ISandboxStatusProps } from "./SandboxStatus.type";

export function useSandboxStatus({ enemiesOnBoard }: ISandboxStatusProps) {
  return {
    label: game.sandbox.status,
    viruses: game.sandbox.viruses,
    value: String(enemiesOnBoard),
  };
}
