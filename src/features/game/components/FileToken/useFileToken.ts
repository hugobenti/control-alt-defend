import { game } from "@/content/game";

import type { IFileTokenProps } from "./FileToken.type";

export function useFileToken({ state, x = 0, y = 0 }: IFileTokenProps, glowId?: string) {
  return {
    transform: `translate(${x} ${y})`,
    glowFilter: glowId ? `url(#${glowId})` : undefined,
    label: game.file[state],
    dropped: state === "dropped",
  };
}
