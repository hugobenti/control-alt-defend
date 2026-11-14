import { game } from "@/content/game";

import type { IEnemyProps, TEnemyLayerKind } from "./Enemy.type";

const FULL_BAR = 24;
const SMALL_BAR = 16;
const FULL_TOP = -21;
const SMALL_TOP = -14;
const FULL_RING = 16;
const SMALL_RING = 11;
const SMALL_SCALE = 0.68;
const FILE_CENTRE_ABOVE_BAR = 10.5;

const HIT_LAYERS: TEnemyLayerKind[] = ["ghostShift", "ghostLight", "main"];
const PLAIN_LAYERS: TEnemyLayerKind[] = ["main"];

export function useEnemy(
  { type, x, y, heading, health, small = false, carrier = false, hit = false }: IEnemyProps,
  glowId?: string,
) {
  const clamped = Math.max(0, Math.min(1, health));
  const barWidth = small ? SMALL_BAR : FULL_BAR;
  const barTop = small ? SMALL_TOP : FULL_TOP;
  return {
    transform: `translate(${x},${y})`,
    bodyTransform: `rotate(${heading}) scale(${small ? SMALL_SCALE : 1})`,
    sliceTransform: `rotate(${heading})`,
    glowFilter: glowId ? `url(#${glowId})` : undefined,
    layers: hit ? HIT_LAYERS : PLAIN_LAYERS,
    trackWidth: barWidth,
    barX: -barWidth / 2,
    barY: barTop,
    barWidth: Math.round(barWidth * clamped * 100) / 100,
    armorPath: `M${barWidth / 2 + 3} ${barTop - 1.5} h5 v3 l-2.5 2 l-2.5 -2z`,
    ringRadius: small ? SMALL_RING : FULL_RING,
    fileY: barTop - FILE_CENTRE_ABOVE_BAR,
    armored: type === "rootkit",
    label: game.enemy(type, Math.round(clamped * 100), carrier),
  };
}
