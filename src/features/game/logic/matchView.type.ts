import type { IBeamProps } from "../components/Beam/Beam.type";
import type { IBoostEdgeProps } from "../components/BoostEdge/BoostEdge.type";
import type { IEnemyProps } from "../components/Enemy/Enemy.type";
import type { IPlacementGhostProps } from "../components/PlacementGhost/PlacementGhost.type";
import type { IRangeRingProps } from "../components/RangeRing/RangeRing.type";
import type { IShotProps } from "../components/Shot/Shot.type";
import type { ITowerProps, TTowerType } from "../components/Tower/Tower.type";
import type { ICell, IPoint } from "./grid.type";

export interface IBoardUi {
  cursor: ICell;
  placing: TTowerType | null;
  selectedTowerId: number | null;
}

export interface IBoardView {
  towers: ITowerProps[];
  enemies: (IEnemyProps & { id: number })[];
  shots: (IShotProps & { id: string })[];
  beams: IBeamProps[];
  boostEdges: IBoostEdgeProps[];
  droppedFiles: { id: number; x: number; y: number }[];
  rangeRing: IRangeRingProps | null;
  ghost: IPlacementGhostProps | null;
  routePreview: IPoint[][];
  files: number;
  filesInCore: number;
}
