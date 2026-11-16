import { balance, TICK_S } from "./balance.data";
import { computeDistanceField } from "./distanceField";
import { CELL } from "./geometry";
import { cellIndex, cellOf, coreRect, discTouchesRect } from "./grid";
import { recomputeFields } from "./match";
import type { IEnemyState, IMatchState } from "./match.type";
import type { TFileState } from "./matchHud.type";
import { moveToward, nextWaypoint, resolveCollision } from "./steering";

export function filesInCore(state: IMatchState): number {
  return state.files.reduce((count, file) => count + Number(file.status === "core"), 0);
}

export function fileStates(state: IMatchState): TFileState[] {
  return [...state.files]
    .sort((a, b) => a.id - b.id)
    .map((file) => (file.status === "core" ? "safe" : file.status));
}

export function dropFile(state: IMatchState, enemy: IEnemyState): IMatchState {
  if (enemy.carrying === null) return state;
  const files = state.files.map((file) =>
    file.id === enemy.carrying
      ? {
          ...file,
          status: "dropped" as const,
          pos: enemy.pos,
          carrierId: null,
          heading: enemy.heading,
        }
      : file,
  );
  return recomputeFields({ ...state, files, events: [...state.events, { kind: "dropped" }] });
}

export function stepFiles(state: IMatchState): IMatchState {
  let fields = state.fields;
  let events = state.events;
  let recovered = filesInCore(state);
  const files = state.files.map((file) => {
    if (file.status !== "dropped" || !file.pos) return file;
    const target = nextWaypoint(
      state.grid,
      fields.toCore,
      file.pos,
      balance.files.radius,
      { x: 0, y: 0 },
      state.grid.core,
    );
    const motion = target
      ? moveToward(
          file.pos,
          file.heading,
          target,
          balance.files.driftSpeed * CELL,
          balance.movement.turnRateDeg,
          TICK_S,
        )
      : { pos: file.pos, heading: file.heading };
    const pos = resolveCollision(state.grid, motion.pos, balance.files.radius);
    if (discTouchesRect(motion.pos, balance.files.radius, coreRect(state.options.map))) {
      const toFile = { ...fields.toFile };
      delete toFile[file.id];
      fields = { ...fields, toFile };
      recovered++;
      events = [...events, { kind: "recovered" as const, filesInCore: recovered }];
      return {
        ...file,
        status: "core" as const,
        pos: null,
        carrierId: null,
        heading: motion.heading,
      };
    }
    const oldCell = cellOf(file.pos);
    const newCell = cellOf(pos);
    if (cellIndex(state.grid, oldCell) !== cellIndex(state.grid, newCell)) {
      fields = {
        ...fields,
        toFile: { ...fields.toFile, [file.id]: computeDistanceField(state.grid, [newCell]) },
      };
    }
    return { ...file, pos, heading: motion.heading };
  });
  return { ...state, files, fields, events };
}
