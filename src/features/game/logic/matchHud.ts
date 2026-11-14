import type { TFileState } from "./matchHud.type";

/** Seconds as m:ss; partial seconds round up so the clock never shows 0:00 early. */
export function formatClock(seconds: number): string {
  const whole = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${rest < 10 ? "0" : ""}${rest}`;
}

export function countFiles(files: TFileState[]) {
  const byState: Record<TFileState, number> = { safe: 0, carried: 0, dropped: 0, leaked: 0 };
  for (const state of files) byState[state] += 1;
  return { byState, notLeaked: files.length - byState.leaked, total: files.length };
}
