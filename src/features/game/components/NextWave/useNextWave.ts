import { game } from "@/content/game";

import { formatClock } from "../../logic/matchHud";
import type { INextWaveProps } from "./NextWave.type";

export function useNextWave({
  wave,
  preview,
  secondsLeft,
  earlyBonus,
  virusesLeft,
}: Pick<INextWaveProps, "wave" | "preview" | "secondsLeft" | "earlyBonus" | "virusesLeft">) {
  const copy = game.header.next;
  return {
    label: copy.label,
    chips: preview.map(({ type, count }) => ({
      type,
      key: type,
      times: copy.times(count),
      name: copy.chip(type, count),
    })),
    timeText: secondsLeft === undefined ? undefined : copy.in(formatClock(secondsLeft)),
    bonusText: earlyBonus === undefined ? undefined : copy.earlyBonus(earlyBonus),
    startNow: copy.startNow,
    startKey: copy.startKey,
    runningText: copy.running(wave),
    virusesText: virusesLeft === undefined ? undefined : copy.virusesLeft(virusesLeft),
  };
}
