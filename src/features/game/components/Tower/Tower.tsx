import { cx } from "@/features/shared/utils/cx";

import { tower as styles } from "./Tower.style";
import type { ITowerProps } from "./Tower.type";
import { useTower } from "./useTower";

export function Tower(props: ITowerProps) {
  const { type, boosted, selected } = props;
  const { transform, barrelTransform, pips, label } = useTower(props);
  return (
    <g role="img" aria-label={label} transform={transform}>
      <rect
        x="-17"
        y="-17"
        width="34"
        height="34"
        rx="6"
        className={cx(styles.pad, styles.color[type])}
        strokeOpacity="0.6"
      />
      {type === "firewall" && (
        <g className={styles.brick}>
          <rect x="-12" y="-10" width="11" height="5.5" rx="1" />
          <rect x="1" y="-10" width="11" height="5.5" rx="1" />
          <rect x="-12" y="-2.75" width="5" height="5.5" rx="1" />
          <rect x="-5" y="-2.75" width="10" height="5.5" rx="1" />
          <rect x="7" y="-2.75" width="5" height="5.5" rx="1" />
          <rect x="-12" y="4.5" width="11" height="5.5" rx="1" />
          <rect x="1" y="4.5" width="11" height="5.5" rx="1" />
        </g>
      )}
      {type === "antivirus" && (
        <g>
          <circle r="10.5" className={styles.disc} />
          <path
            d="M0 -6.5 L5.5 -4 V1 C5.5 4.6 2.8 6.6 0 7.6 C-2.8 6.6 -5.5 4.6 -5.5 1 V-4 Z"
            className={styles.shield}
          />
          <rect
            x="-1.8"
            y="-19"
            width="3.6"
            height="9"
            rx="1"
            transform={barrelTransform}
            className={styles.shield}
          />
        </g>
      )}
      {type === "debugger" && (
        <g>
          <path d="M0 -11.5 L11.5 0 L0 11.5 L-11.5 0Z" className={styles.diamond} />
          <circle r="4" className={styles.emitter} />
          <path
            d="M0 -15 v3 M0 12 v3 M-15 0 h3 M12 0 h3"
            strokeLinecap="round"
            className={styles.guide}
          />
        </g>
      )}
      {pips.map((pip) => (
        <rect
          key={pip.x}
          x={pip.x}
          y="12.2"
          width="5"
          height="2.4"
          rx="0.6"
          className={pip.active ? styles.pip.on[type] : styles.pip.off}
        />
      ))}
      {boosted && (
        <path
          d="M9 -10.5 l3.5 -3.5 l3.5 3.5 M9 -6.5 l3.5 -3.5 l3.5 3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.boost}
        />
      )}
      {selected && (
        <path
          d="M-21 -14V-21H-14 M14 -21H21V-14 M21 14V21H14 M-14 21H-21V14"
          className={styles.selected}
        />
      )}
    </g>
  );
}
