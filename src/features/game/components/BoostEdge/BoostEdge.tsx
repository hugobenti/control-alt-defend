import { game } from "@/content/game";

import { useGameDefs } from "../GameDefs/useGameDefs";
import { boostEdge as styles } from "./BoostEdge.style";
import type { IBoostEdgeProps } from "./BoostEdge.type";
import { useBoostEdge, useBoostEdgeGlow } from "./useBoostEdge";

export function BoostEdge(props: IBoostEdgeProps) {
  const line = useBoostEdge(props);
  const defs = useGameDefs();
  const filter = useBoostEdgeGlow(defs?.glow);
  if (!line) return null;
  return (
    <line
      role="img"
      aria-label={game.boostEdge}
      {...line}
      strokeLinecap="round"
      filter={filter}
      className={styles.line}
    />
  );
}
