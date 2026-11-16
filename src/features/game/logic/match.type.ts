import type { TEnemyType } from "../components/Enemy/Enemy.type";
import type { TTowerType, TVersion } from "../components/Tower/Tower.type";
import type { ILevelMap } from "../level/level.type";
import type { ICell, IGrid, IPoint } from "./grid.type";
import type { TPlacementRefusal } from "./placement.type";

export interface ITowerState {
  id: number;
  type: TTowerType;
  version: TVersion;
  c: number;
  r: number;
  spent: number;
  cooldownTicks: number;
  beamTargetId: number | null;
  beamTicks: number;
  kills: number;
  aimAt: IPoint | null;
}

export type TEnemyGoal = "core" | "file" | "exit";
export interface IEnemyState {
  id: number;
  type: TEnemyType;
  small: boolean;
  pos: IPoint;
  heading: number;
  health: number;
  maxHealth: number;
  carrying: number | null;
  offset: IPoint;
  hitUntilTick: number;
  touchedEmptyCore: boolean;
  goal: TEnemyGoal;
}

export type TFileStatus = "core" | "carried" | "dropped" | "leaked";
export interface IFileState {
  id: number;
  status: TFileStatus;
  pos: IPoint | null;
  carrierId: number | null;
  heading: number;
}

export interface IShotState {
  from: IPoint;
  to: IPoint;
  untilTick: number;
}

export interface IBeamState {
  towerId: number;
  from: IPoint;
  to: IPoint;
  ramp: number;
  chainTo: IPoint | null;
}

export interface IPendingSpawn {
  type: TEnemyType;
  portId: string;
  atTick: number;
}

export interface IFields {
  toCore: Float64Array;
  toExit: Float64Array;
  toFile: Record<number, Float64Array>;
}

export type TMatchStatus = "playing" | "over";
export interface IMatchOptions {
  map: ILevelMap;
  seed: number;
  startBits: number;
  files: number;
}

export interface IMatchState {
  options: IMatchOptions;
  tick: number;
  grid: IGrid;
  fields: IFields;
  towers: ITowerState[];
  enemies: IEnemyState[];
  files: IFileState[];
  shots: IShotState[];
  beams: IBeamState[];
  pendingSpawns: IPendingSpawn[];
  bits: number;
  status: TMatchStatus;
  seed: number;
  nextId: number;
  events: TMatchEvent[];
}

export type TMatchCommand =
  | { kind: "place"; type: TTowerType; cell: ICell }
  | { kind: "upgrade"; towerId: number }
  | { kind: "sell"; towerId: number }
  | { kind: "spawn"; type: TEnemyType; portId: string; count: number }
  | { kind: "grantBits" }
  | { kind: "restart" };

export type TMatchEvent =
  | { kind: "refused"; reason: TPlacementRefusal | "maxVersion" }
  | { kind: "placed"; towerId: number }
  | { kind: "sold"; refund: number }
  | { kind: "upgraded"; towerId: number }
  | { kind: "stolen"; filesInCore: number }
  | { kind: "dropped" }
  | { kind: "recovered"; filesInCore: number }
  | { kind: "leaked"; leaked: number; total: number }
  | { kind: "killed"; type: TEnemyType; reward: number }
  | { kind: "gameOver" };
