import type { TTowerType, TVersion } from "../Tower/Tower.type";

export interface ITowerArtProps {
  type: TTowerType;
  version: TVersion;
  className?: string;
}
