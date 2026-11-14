import { iconPaths } from "@/features/shared/components/Icon/Icon.data";

import { useGameDefs } from "../GameDefs/useGameDefs";
import { Tower } from "../Tower/Tower";
import { placementGhost as styles } from "./PlacementGhost.style";
import type { IPlacementGhostProps } from "./PlacementGhost.type";
import { usePlacementGhost } from "./usePlacementGhost";

export function PlacementGhost(props: IPlacementGhostProps) {
  const { type, c, r, valid, reason } = props;
  const defs = useGameDefs();
  const { label, reasonId, tile, badgeTransform, blockTransform, tooltipTransform, invalidFill } =
    usePlacementGhost(props, defs?.invalid);
  return (
    <g role="img" aria-label={label} aria-describedby={reasonId}>
      {valid ? (
        <g>
          <g opacity="0.55">
            <Tower type={type} version={1} c={c} r={r} />
          </g>
          <rect {...tile} width="38" height="38" rx="6" className={styles.valid} />
          <g transform={badgeTransform}>
            <circle r="8" className={styles.badge} />
            <path
              d={iconPaths.check.d}
              transform="translate(-6,-6) scale(0.5)"
              className={styles.check}
            />
          </g>
        </g>
      ) : (
        <g>
          <rect
            {...tile}
            width="38"
            height="38"
            rx="6"
            fill={invalidFill}
            className={styles.invalid}
          />
          <path d={iconPaths.block.d} transform={blockTransform} className={styles.block} />
          {reason && (
            <g transform={tooltipTransform}>
              <rect x="0" y="0" width="250" height="30" rx="6" className={styles.tooltip} />
              <text id={reasonId} x="12" y="19" className={styles.text}>
                {reason}
              </text>
            </g>
          )}
        </g>
      )}
    </g>
  );
}
