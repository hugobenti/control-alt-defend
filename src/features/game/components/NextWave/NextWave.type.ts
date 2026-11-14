import type { TEnemyType } from "../Enemy/Enemy.type";

interface IWavePreviewItem {
  type: TEnemyType;
  count: number;
}

export interface INextWaveProps {
  phase: "break" | "running";
  /** Number of the wave being prepared (break) or fought (running). */
  wave: number;
  preview: IWavePreviewItem[];
  /** Break: seconds until the wave starts by itself. */
  secondsLeft?: number;
  /** Break: bits earned by starting early. */
  earlyBonus?: number;
  /** Running: viruses still alive or yet to spawn. */
  virusesLeft?: number;
  onStartNow: () => void;
  className?: string;
}
