import type { MouseEvent, PointerEvent, RefObject } from "react";

import type { ILiveRegionState } from "@/features/shared/components/LiveRegion/LiveRegion.type";

import type { TEnemyType } from "../Enemy/Enemy.type";
import type { TSpawnCount } from "../SandboxControls/SandboxControls.type";
import type { TGameSpeed } from "../SettingsMenu/SettingsMenu.type";
import type { TTowerType } from "../Tower/Tower.type";
import type { ILevelMap } from "../../level/level.type";
import type { ICell } from "../../logic/grid.type";
import type { IMatchState } from "../../logic/match.type";
import type { TFileState } from "../../logic/matchHud.type";
import type { IBoardView } from "../../logic/matchView.type";
import type { IBuildItemProps } from "../BuildItem/BuildItem.type";
import type { ITowerCardProps } from "../TowerCard/TowerCard.type";

export interface ISandboxScreenProps {
  initialState?: IMatchState;
}
export interface IBoardInputHandlers {
  map: ILevelMap;
  onCell: (cell: ICell) => void;
  onActivate: (cell: ICell) => void;
  onCancel: () => void;
}
export interface IBoardInput {
  ref: RefObject<HTMLDivElement | null>;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  onContextMenu: (event: MouseEvent<HTMLDivElement>) => void;
}
export interface IMatchKeyHandlers {
  map: ILevelMap;
  cursor: ICell;
  moveCursor: (cell: ICell) => void;
  pickTower: (tower: TTowerType) => void;
  cancel: () => void;
  upgrade: () => void;
  sell: () => void;
  toggleSpeed: () => void;
  spawn: (type: TEnemyType) => void;
  grantBits: () => void;
  activate: () => void;
  togglePause: () => void;
  over: boolean;
}
export interface ISandboxScreenView {
  map: ILevelMap;
  bits: number;
  tick: number;
  status: IMatchState["status"];
  cursor: ICell;
  placing: TTowerType | null;
  files: TFileState[];
  boardView: IBoardView;
  buildItems: IBuildItemProps[];
  towerCard: Omit<ITowerCardProps, "onUpgrade" | "onSell"> | null;
  paused: boolean;
  speed: TGameSpeed;
  defaultSpeed: TGameSpeed;
  sound: boolean;
  settingsOpen: boolean;
  spawnPort: string;
  spawnCount: TSpawnCount;
  ports: { value: string; text: string }[];
  liveRegion: ILiveRegionState;
  boardInput: IBoardInput;
  instructionsId: string;
  moveCursor: (cell: ICell) => void;
  pickTower: (type: TTowerType) => void;
  activate: (cell?: ICell) => void;
  cancel: () => void;
  upgrade: () => void;
  sell: () => void;
  spawn: (type: TEnemyType) => void;
  grantBits: () => void;
  togglePause: () => void;
  toggleSpeed: () => void;
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: TGameSpeed) => void;
  setDefaultSpeed: (speed: TGameSpeed) => void;
  setSound: (sound: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setSpawnPort: (port: string) => void;
  setSpawnCount: (count: TSpawnCount) => void;
  restart: () => void;
  quit: () => void;
}
