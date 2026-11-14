import { game } from "@/content/game";

import type { IDataCoreProps } from "./DataCore.type";

export function useDataCore({ files, filesInCore, x = 0, y = 0 }: IDataCoreProps) {
  return {
    transform: `translate(${x} ${y})`,
    label: game.core(filesInCore, files),
    title: game.coreLabel,
    pins: Array.from({ length: 8 }, (_, i) => ({ key: i, position: -30 + i * 8.6 - 1.6 })),
    slots: Array.from({ length: files }, (_, i) => ({
      transform: `translate(${-18 + (i % 4) * 12} ${-4 + Math.floor(i / 4) * 17})`,
      lit: i < filesInCore,
    })),
  };
}
