import { applyCommand } from "../logic/match";
import type { IMatchState } from "../logic/match.type";
import { step } from "../logic/step";
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
      let next = state;
      let events: IMatchState["events"] | null = null;
      for (let i = 0; i < ticks; i++) {
        next = step(next);
        if (next.events.length) events = events === null ? next.events : events.concat(next.events);
      }
      state = events && events !== next.events ? { ...next, events } : next;
      notify();
    },
  };
}
