import type { ReactNode } from "react";

import type { ILevelMap } from "../../level/level.type";

export interface IBoardProps {
  map: ILevelMap;
  children?: ReactNode;
  className?: string;
}
