"use client";

import { game } from "@/content/game";
import { Button } from "@/features/shared/components/Button/Button";

import { gameOverOverlay as styles } from "./GameOverOverlay.style";
import type { IGameOverOverlayProps } from "./GameOverOverlay.type";
import { useGameOverOverlay } from "./useGameOverOverlay";

export function GameOverOverlay({ open, files, onRestart }: IGameOverOverlayProps) {
  const { buttonRef, titleId } = useGameOverOverlay({ open });
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.base}>
      <div className={styles.panel}>
        <h2 id={titleId} className={styles.title}>
          {game.gameOver.title}
        </h2>
        <p className={styles.text}>{game.gameOver.text(files)}</p>
        <Button ref={buttonRef} onClick={onRestart} className={styles.action}>
          {game.gameOver.restart}
        </Button>
      </div>
    </div>
  );
}
