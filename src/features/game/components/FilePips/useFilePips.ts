import { game } from "@/content/game";

import { countFiles } from "../../logic/matchHud";
import type { IFilePipsProps } from "./FilePips.type";

export function useFilePips({ files }: Pick<IFilePipsProps, "files">) {
  return {
    summary: game.files.summary(countFiles(files).byState),
    pips: files.map((state, index) => ({ state, key: `${index}-${state}` })),
  };
}
