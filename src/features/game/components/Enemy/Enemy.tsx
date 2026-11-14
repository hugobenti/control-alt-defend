import { FileToken } from "../FileToken/FileToken";
import { useGameDefs } from "../GameDefs/useGameDefs";
import { enemy as styles } from "./Enemy.style";
import type { IEnemyProps } from "./Enemy.type";
import { useEnemy } from "./useEnemy";

export function Enemy(props: IEnemyProps) {
  const { type, carrier, hit } = props;
  const defs = useGameDefs();
  const view = useEnemy(props, defs?.glow);
  return (
    <g role="img" aria-label={view.label} transform={view.transform}>
      <g data-hit={hit ? "" : undefined} className={hit ? styles.fadeOnHit : undefined}>
        <g transform={view.bodyTransform}>
          {view.layers.map((kind) => (
            <g key={kind} className={styles.layer[kind]}>
              {type === "worm" && (
                <>
                  <g filter={view.glowFilter}>
                    <circle cx="-11.5" cy="2.2" r="3.4" className={styles.wormSegment.tail} />
                    <circle cx="-6" cy="-1" r="4.3" className={styles.wormSegment.mid} />
                    <circle cx="0.3" cy="1" r="5" className={styles.wormSegment.body} />
                    <circle cx="7.6" cy="-0.4" r="6" className={styles.wormSegment.head} />
                  </g>
                  <rect x="9" y="-3.2" width="3.2" height="1.8" rx="0.4" className={styles.eye} />
                  <rect x="9" y="0.6" width="3.2" height="1.8" rx="0.4" className={styles.eye} />
                </>
              )}
              {type === "rootkit" && (
                <>
                  <g filter={view.glowFilter}>
                    <path
                      d="M0 -13.5 L11.7 -6.75 L11.7 6.75 L0 13.5 L-11.7 6.75 L-11.7 -6.75Z"
                      strokeLinejoin="round"
                      className={styles.shell}
                    />
                    <path d="M0 -6 L5.2 -3 L5.2 3 L0 6 L-5.2 3 L-5.2 -3Z" className={styles.core} />
                  </g>
                  <path
                    d="M0 -6 V-12 M5.2 -3 L10.2 -5.9 M5.2 3 L10.2 5.9 M0 6 V12 M-5.2 3 L-10.2 5.9 M-5.2 -3 L-10.2 -5.9"
                    className={styles.plates}
                  />
                </>
              )}
            </g>
          ))}
        </g>
        {hit && (
          <rect
            x="-14"
            y="-3"
            width="28"
            height="2.2"
            transform={view.sliceTransform}
            className={styles.slice}
          />
        )}
      </g>
      {carrier && (
        <>
          <circle r={view.ringRadius} strokeDasharray="3 3" className={styles.ring} />
          <g aria-hidden="true">
            <FileToken state="inCore" y={view.fileY} />
          </g>
        </>
      )}
      <rect
        x={view.barX}
        y={view.barY}
        width={view.trackWidth}
        height="3"
        rx="1"
        className={styles.track}
      />
      <rect
        x={view.barX}
        y={view.barY}
        width={view.barWidth}
        height="3"
        rx="1"
        className={styles.fill}
      />
      {view.armored && <path d={view.armorPath} className={styles.armor} />}
    </g>
  );
}
