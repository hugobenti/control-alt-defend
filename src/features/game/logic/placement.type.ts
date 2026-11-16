import type { ILevelMap } from "../level/level.type";
import type { ICell, IGrid, IPoint } from "./grid.type";

export type TPlacementRefusal =
  | "keepOut"
  | "occupied"
  | "blocksRoute"
  | "trapsPiece"
  | "overlapsEnemy"
  | "overlapsFile"
  | "notEnoughBits";

export interface IPlacementInput {
  map: ILevelMap;
  grid: IGrid;
  cell: ICell;
  cost: number;
  bits: number;
  enemies: { pos: IPoint; radius: number }[];
  droppedFiles: IPoint[];
}
