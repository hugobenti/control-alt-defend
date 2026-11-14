import { createContext, useContext, useId } from "react";

import type { IGameDefsIds } from "./GameDefs.type";

export const GameDefsContext = createContext<IGameDefsIds | null>(null);

export function useGameDefsIds(): IGameDefsIds {
  const id = useId();
  return {
    glow: `${id}-glow`,
    dots: `${id}-dots`,
    keepout: `${id}-keepout`,
    invalid: `${id}-invalid`,
  };
}

/** Optional outside a Board, for isolated component stories. */
export function useGameDefs(): IGameDefsIds | null {
  return useContext(GameDefsContext);
}
