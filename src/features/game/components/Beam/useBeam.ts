import type { IBeamProps } from "./Beam.type";

export function useBeam({ ramp }: IBeamProps, glowId?: string) {
  const intensity = Math.max(0, Math.min(1, ramp));
  return {
    filter: glowId ? `url(#${glowId})` : undefined,
    haloWidth: 2 + intensity * 3,
    coreWidth: 1.3 + intensity,
    impactRadius: 3 + intensity * 2,
  };
}
