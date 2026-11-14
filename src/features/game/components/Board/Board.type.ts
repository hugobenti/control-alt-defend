import type { ReactNode } from "react";

import type { ILevelMap } from "../../level/level.type";

export interface IBoardProps {
  map: ILevelMap;
  files?: number;
  filesInCore?: number;
  children?: ReactNode;
  className?: string;
}
