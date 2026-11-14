import { useGameDefs } from "../GameDefs/useGameDefs";
import { beam as styles } from "./Beam.style";
import type { IBeamProps } from "./Beam.type";
import { useBeam } from "./useBeam";

export function Beam(props: IBeamProps) {
  const { from, to } = props;
  const defs = useGameDefs();
  const { haloWidth, coreWidth, impactRadius, filter } = useBeam(props, defs?.glow);
  return (
    <g aria-hidden="true">
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        strokeWidth={haloWidth}
        strokeLinecap="round"
        filter={filter}
        className={styles.halo}
      />
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        strokeWidth={coreWidth}
        strokeLinecap="round"
        className={styles.core}
      />
      <circle cx={to.x} cy={to.y} r={impactRadius} filter={filter} className={styles.impact} />
    </g>
  );
}
