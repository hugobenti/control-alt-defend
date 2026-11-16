import { boardCursor as styles } from "./BoardCursor.style";
import type { IBoardCursorProps } from "./BoardCursor.type";
import { useBoardCursor } from "./useBoardCursor";

export function BoardCursor(props: IBoardCursorProps) {
  const { x, y, label, ticks } = useBoardCursor(props);
  return (
    <g role="img" aria-label={label}>
      <rect x={x} y={y} width="38" height="38" className={styles.outline} />
      <path d={ticks} className={styles.ticks} />
    </g>
  );
}
