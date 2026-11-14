import { applyCommand } from "../logic/match";
import type { IMatchState } from "../logic/match.type";
import { runTicks } from "../logic/step";
import type { IMatchStore } from "./matchStore.type";

export function createMatchStore(initial: IMatchState): IMatchStore {
  let state = initial;
  const listeners = new Set<() => void>();
  const notify = () => {
    for (const listener of listeners) listener();
  };
  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispatch(command) {
      state = applyCommand(state, command);
      notify();
    },
    advance(ticks) {
      if (ticks <= 0) return;
      state = runTicks(state, ticks);
      notify();
    },
  };
}
