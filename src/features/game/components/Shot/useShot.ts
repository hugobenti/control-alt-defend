import type { IShotProps } from "./Shot.type";

export function useShot({ from, to }: IShotProps, glowId?: string) {
  const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
  return {
    transform: `translate(${from.x},${from.y}) rotate(${angle})`,
    filter: glowId ? `url(#${glowId})` : undefined,
  };
}
