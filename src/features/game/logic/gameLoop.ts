import { TICK_S } from "./balance.data";

export const MAX_FRAME_S = 0.1;

export function ticksToRun(
  accumulatorS: number,
  frameS: number,
  speed: 1 | 2,
): { ticks: number; rest: number } {
  const acc = accumulatorS + Math.min(frameS, MAX_FRAME_S) * speed;
  const ticks = Math.floor(acc / TICK_S);
  return { ticks, rest: acc - ticks * TICK_S };
}
