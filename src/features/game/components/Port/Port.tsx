import { port as styles } from "./Port.style";
import type { IPortProps } from "./Port.type";
import { usePort } from "./usePort";
import { useGameDefs } from "../GameDefs/useGameDefs";

export function Port(props: IPortProps) {
  const ids = useGameDefs();
  const layout = usePort(props, ids?.keepout);
  return (
    <g aria-hidden="true">
      <rect {...layout.gap} className={styles.gap} />
      {layout.fingers.map((finger, index) => (
        <rect key={index} {...finger} rx="1" className={styles.finger} />
      ))}
      <rect {...layout.hatch} fill={layout.hatchFill} />
      <rect {...layout.outline} className={styles.outline} />
      <text
        x={layout.label.x}
        y={layout.label.y}
        textAnchor={layout.label.anchor}
        className={styles.label}
      >
        {layout.text}
      </text>
    </g>
  );
}
