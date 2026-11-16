import type { IMatchState, TMatchCommand } from "../logic/match.type";

export interface IMatchStore {
  getState(): IMatchState;
  subscribe(listener: () => void): () => void;
  dispatch(command: TMatchCommand): void;
  advance(ticks: number): void;
}
