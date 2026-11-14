import { useSyncExternalStore } from "react";

import type { IMatchState } from "../logic/match.type";
import type { IMatchStore } from "./matchStore.type";

export function useMatchStore(store: IMatchStore): IMatchState {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
