import { obstacle as styles } from "./Obstacle.style";
import type { IObstacleProps } from "./Obstacle.type";
import { useObstacle } from "./useObstacle";

export function Obstacle({ obstacle }: IObstacleProps) {
  const shape = useObstacle(obstacle);
  return (
    <g transform={shape.transform} aria-hidden="true">
      {obstacle.kind === "chip" && (
        <>
          {shape.legs.map((leg) => (
            <g key={leg.x}>
              <rect x={leg.x} y="1" width="4" height="6" className={styles.pin} />
              <rect x={leg.x} y={leg.bottom} width="4" height="6" className={styles.pin} />
            </g>
          ))}
          <rect
            x="3"
            y="6"
            width={shape.chipWidth}
            height={shape.chipHeight}
            rx="3"
            className={styles.chip}
          />
          <circle cx="10" cy="13" r="2.2" className={styles.dot} />
          <text
            x={shape.chipTextX}
            y={shape.chipTextY}
            textAnchor="middle"
            className={styles.chipText}
          >
            {obstacle.text}
          </text>
          <text x="2" y="-4" className={styles.label}>
            {obstacle.label}
          </text>
        </>
      )}
      {obstacle.kind === "capacitor" && (
        <>
          {shape.capacitors.map((cap) => (
            <g key={cap.transform} transform={cap.transform}>
              <circle r="16" className={styles.capacitor} />
              <path d="M0 -16 A16 16 0 0 1 0 16" className={styles.capArc} />
              <path d="M-8 0h8 M-4 -4v8" className={styles.capMark} />
            </g>
          ))}
          <text
            x={shape.capacitorLabel.x}
            y={shape.capacitorLabel.y}
            textAnchor="start"
            className={styles.label}
          >
            {obstacle.label}
          </text>
        </>
      )}
      {obstacle.kind === "resistor" && (
        <>
          <rect x="2" y="17" width="8" height="6" className={styles.pin} />
          <rect x={shape.resistorEndX} y="17" width="8" height="6" className={styles.pin} />
          <rect
            x="9"
            y="9"
            width={shape.resistorWidth}
            height="22"
            rx="6"
            className={styles.resistor}
          />
          {shape.bands.map((x) => (
            <rect key={x} x={x} y="9" width="3.5" height="22" className={styles.band} />
          ))}
          <text x="2" y="2" className={styles.label}>
            {obstacle.label}
          </text>
        </>
      )}
      {obstacle.kind === "crystal" && (
        <>
          <rect
            x="4"
            y="8"
            width={shape.crystalWidth}
            height="24"
            rx="12"
            className={styles.crystal}
          />
          <rect
            x="10"
            y="13"
            width={shape.crystalInsetWidth}
            height="14"
            rx="7"
            className={styles.crystalInset}
          />
          <text x="2" y="4" className={styles.label}>
            {obstacle.label}
          </text>
        </>
      )}
    </g>
  );
}
