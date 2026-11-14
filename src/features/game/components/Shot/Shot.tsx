import { useGameDefs } from "../GameDefs/useGameDefs";
import { shot as styles } from "./Shot.style";
import type { IShotProps } from "./Shot.type";
import { useShot } from "./useShot";

export function Shot(props: IShotProps) {
  const defs = useGameDefs();
  const { transform, filter } = useShot(props, defs?.glow);
  return (
    <g aria-hidden="true" transform={transform}>
      <line x1="-16" y1="0" x2="0" y2="0" strokeLinecap="round" className={styles.trail} />
      <rect
        x="-4"
        y="-1.8"
        width="8"
        height="3.6"
        rx="1.8"
        filter={filter}
        className={styles.head}
      />
    </g>
  );
}
