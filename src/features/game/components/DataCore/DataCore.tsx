import { FileToken } from "../FileToken/FileToken";
import { dataCore as styles } from "./DataCore.style";
import type { IDataCoreProps } from "./DataCore.type";
import { useDataCore } from "./useDataCore";

export function DataCore(props: IDataCoreProps) {
  const layout = useDataCore(props);
  return (
    <g transform={layout.transform} role="img" aria-label={layout.label}>
      {layout.pins.map((pin) => (
        <g key={pin.key} aria-hidden="true">
          <rect x={pin.position} y="-46" width="3.2" height="7" className={styles.pin} />
          <rect x={pin.position} y="39" width="3.2" height="7" className={styles.pin} />
          <rect x="-46" y={pin.position} width="7" height="3.2" className={styles.pin} />
          <rect x="39" y={pin.position} width="7" height="3.2" className={styles.pin} />
        </g>
      ))}
      <rect
        x="-39"
        y="-39"
        width="78"
        height="78"
        rx="5"
        className={styles.package}
        aria-hidden="true"
      />
      <rect
        x="-29"
        y="-29"
        width="58"
        height="58"
        rx="3"
        className={styles.die}
        aria-hidden="true"
      />
      <circle cx="-33" cy="-33" r="2" className={styles.marker} aria-hidden="true" />
      <text x="0" y="-16" textAnchor="middle" className={styles.label} aria-hidden="true">
        {layout.title}
      </text>
      {layout.slots.map((slot, index) => (
        <g key={index} transform={slot.transform} aria-hidden="true">
          {slot.lit ? (
            <FileToken state="inCore" />
          ) : (
            <path d="M-3.8 -4.9h4.9l2.7 2.7v7.1h-7.6z" className={styles.empty} />
          )}
        </g>
      ))}
    </g>
  );
}
