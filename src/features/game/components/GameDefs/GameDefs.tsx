import { gameDefs } from "./GameDefs.style";
import type { IGameDefsProps } from "./GameDefs.type";

export function GameDefs({ ids }: IGameDefsProps) {
  return (
    <defs aria-hidden="true">
      <filter
        id={ids.glow}
        filterUnits="userSpaceOnUse"
        x="-100"
        y="-100"
        width="1200"
        height="900"
      >
        <feGaussianBlur stdDeviation="2.6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <pattern id={ids.dots} width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="0" cy="0" r="1.3" className={gameDefs.dot} />
        <circle cx="40" cy="0" r="1.3" className={gameDefs.dot} />
        <circle cx="0" cy="40" r="1.3" className={gameDefs.dot} />
        <circle cx="40" cy="40" r="1.3" className={gameDefs.dot} />
      </pattern>
      <pattern
        id={ids.keepout}
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="8" height="8" className={gameDefs.board} />
        <rect width="2" height="8" className={gameDefs.keepout} />
      </pattern>
      <pattern
        id={ids.invalid}
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="8" height="8" className={gameDefs.invalidGround} />
        <rect width="2.5" height="8" className={gameDefs.invalid} />
      </pattern>
    </defs>
  );
}
