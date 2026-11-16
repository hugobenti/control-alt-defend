import { stepCombat } from "./combat";
import { spawnDue, stepEnemies } from "./enemies";
import { stepFiles } from "./files";
import type { IMatchState } from "./match.type";

export function step(state: IMatchState): IMatchState {
  if (state.status === "over") return { ...state, events: [] };
  let next = { ...state, events: [] as IMatchState["events"] };
  next = spawnDue(next);
  next = stepCombat(next);
  next = stepEnemies(next);
  next = stepFiles(next);
  next = { ...next, tick: next.tick + 1 };
  if (next.files.every((file) => file.status === "leaked"))
    next = { ...next, status: "over", events: [...next.events, { kind: "gameOver" }] };
  return next;
}

export function runTicks(state: IMatchState, n: number): IMatchState {
  let next = state;
  for (let i = 0; i < n; i++) next = step(next);
  return next;
}
