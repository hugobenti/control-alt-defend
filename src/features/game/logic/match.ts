import type { ILevelMap } from "../level/level.type";
import { balance, TICK_S } from "./balance.data";
import { computeDistanceField } from "./distanceField";
import { buildCost, sellRefund, upgradeCost } from "./economy";
import { buildStaticGrid, cellOf, coreCells, portCells, withBlocked, withoutBlocked } from "./grid";
import type { IGrid } from "./grid.type";
import type {
  IFields,
  IFileState,
  IMatchOptions,
  IMatchState,
  TMatchCommand,
  TMatchEvent,
} from "./match.type";
import { checkPlacement } from "./placement";

function fieldsFor(grid: IGrid, map: ILevelMap, files: IFileState[]): IFields {
  const toFile: IFields["toFile"] = {};
  for (const file of files) {
    if (file.status === "dropped" && file.pos) {
      toFile[file.id] = computeDistanceField(grid, [cellOf(file.pos)]);
    }
  }
  return {
    toCore: computeDistanceField(grid, coreCells(map)),
    toExit: computeDistanceField(
      grid,
      map.ports.flatMap((port) => portCells(map, port)),
    ),
    toFile,
  };
}

export function recomputeFields(state: IMatchState): IMatchState {
  return { ...state, fields: fieldsFor(state.grid, state.options.map, state.files) };
}

export function createMatch(options: IMatchOptions): IMatchState {
  const grid = buildStaticGrid(options.map);
  const files: IFileState[] = Array.from({ length: options.files }, (_, id) => ({
    id,
    status: "core",
    pos: null,
    carrierId: null,
    heading: 0,
  }));
  const state: IMatchState = {
    options,
    tick: 0,
    grid,
    fields: fieldsFor(grid, options.map, files),
    towers: [],
    enemies: [],
    files,
    shots: [],
    beams: [],
    pendingSpawns: [],
    bits: options.startBits,
    status: "playing",
    seed: options.seed,
    nextId: 0,
    events: [],
  };
  return state;
}

export function applyCommand(state: IMatchState, command: TMatchCommand): IMatchState {
  if (command.kind === "restart") return createMatch(state.options);
  if (command.kind === "grantBits")
    return { ...state, bits: state.bits + balance.economy.grantBits };
  if (command.kind === "spawn") {
    const spacing = Math.round(balance.sandbox.groupSpacingS / TICK_S);
    return {
      ...state,
      pendingSpawns: [
        ...state.pendingSpawns,
        ...Array.from({ length: command.count }, (_, i) => ({
          type: command.type,
          portId: command.portId,
          atTick: state.tick + i * spacing,
        })),
      ],
    };
  }
  if (command.kind === "place") {
    const cost = buildCost(command.type);
    const refusal = checkPlacement({
      map: state.options.map,
      grid: state.grid,
      cell: command.cell,
      cost,
      bits: state.bits,
      enemies: state.enemies.map((enemy) => ({
        pos: enemy.pos,
        radius:
          enemy.type === "worm" && enemy.small
            ? balance.enemies.wormSmall.radius
            : balance.enemies[enemy.type].radius,
      })),
      droppedFiles: state.files.flatMap((file) =>
        file.status === "dropped" && file.pos ? [file.pos] : [],
      ),
    });
    if (refusal)
      return { ...state, events: [...state.events, { kind: "refused", reason: refusal }] };
    const towerId = state.nextId;
    return recomputeFields({
      ...state,
      towers: [
        ...state.towers,
        {
          id: towerId,
          type: command.type,
          version: 1,
          c: command.cell.c,
          r: command.cell.r,
          spent: cost,
          cooldownTicks: 0,
          beamTargetId: null,
          beamTicks: 0,
          kills: 0,
          aimAt: null,
        },
      ],
      grid: withBlocked(state.grid, [command.cell]),
      bits: state.bits - cost,
      nextId: towerId + 1,
      events: [...state.events, { kind: "placed", towerId }],
    });
  }
  const tower = state.towers.find((candidate) => candidate.id === command.towerId);
  if (!tower) return state;
  if (command.kind === "upgrade") {
    const cost = upgradeCost(tower.type, tower.version);
    const reason: Extract<TMatchEvent, { kind: "refused" }>["reason"] | null =
      cost === null ? "maxVersion" : state.bits < cost ? "notEnoughBits" : null;
    if (reason) return { ...state, events: [...state.events, { kind: "refused", reason }] };
    return {
      ...state,
      towers: state.towers.map((item) =>
        item.id === tower.id
          ? { ...item, version: (item.version + 1) as 2 | 3, spent: item.spent + cost! }
          : item,
      ),
      bits: state.bits - cost!,
      events: [...state.events, { kind: "upgraded", towerId: tower.id }],
    };
  }
  const refund = sellRefund(tower.spent);
  return recomputeFields({
    ...state,
    towers: state.towers.filter((item) => item.id !== tower.id),
    grid: withoutBlocked(state.grid, [{ c: tower.c, r: tower.r }]),
    bits: state.bits + refund,
    events: [...state.events, { kind: "sold", refund }],
  });
}
