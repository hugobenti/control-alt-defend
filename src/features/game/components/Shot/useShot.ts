import type { IShotProps } from "./Shot.type";

export function useShot({ from, to, progress }: IShotProps, glowId?: string) {
  const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
  const distance = Math.max(0, Math.min(1, progress));
  return {
    transform: `translate(${from.x + (to.x - from.x) * distance},${from.y + (to.y - from.y) * distance}) rotate(${angle})`,
    staticTransform: `translate(${from.x},${from.y}) rotate(${angle})`,
    reducedOpacity: 1 - distance,
    impact: distance === 1,
    impactTransform: `translate(${to.x},${to.y})`,
    filter: glowId ? `url(#${glowId})` : undefined,
  };
}
