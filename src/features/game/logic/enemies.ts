import { balance, TICK_S } from "./balance.data";
import type { IEnemyStats } from "./balance.type";
import { filesInCore } from "./files";
import { CELL, cellCenter } from "./geometry";
import { cellIndex, cellOf, coreRect, discTouchesRect, portCells } from "./grid";
import type { IEnemyState, IMatchState, TEnemyGoal } from "./match.type";
import { nextRandom, randomRange } from "./rng";
import { moveToward, nextWaypoint, resolveCollision } from "./steering";

export function enemyStats(enemy: IEnemyState): IEnemyStats {
  return enemy.type === "worm" && enemy.small
    ? balance.enemies.wormSmall
    : balance.enemies[enemy.type];
}

export function spawnDue(state: IMatchState): IMatchState {
  let seed = state.seed;
  let nextId = state.nextId;
  const enemies = [...state.enemies];
  const pendingSpawns = [];
  for (const spawn of state.pendingSpawns) {
    if (spawn.atTick > state.tick) {
      pendingSpawns.push(spawn);
      continue;
    }
    const port = state.options.map.ports.find((candidate) => candidate.id === spawn.portId);
    if (!port) continue;
    const choice = nextRandom(seed);
    const horizontal = randomRange(
      choice.seed,
      -balance.movement.offsetMax,
      balance.movement.offsetMax,
    );
    const vertical = randomRange(
      horizontal.seed,
      -balance.movement.offsetMax,
      balance.movement.offsetMax,
    );
    seed = vertical.seed;
    const cell = portCells(state.options.map, port)[choice.value < 0.5 ? 0 : 1];
    const stats = balance.enemies[spawn.type];
    const heading =
      port.side === "left" ? 0 : port.side === "right" ? 180 : port.side === "top" ? 90 : -90;
    enemies.push({
      id: nextId++,
      type: spawn.type,
      small: false,
      pos: { x: cellCenter(cell.c), y: cellCenter(cell.r) },
      heading,
      health: stats.health,
      maxHealth: stats.health,
      carrying: null,
      offset: { x: horizontal.value, y: vertical.value },
      hitUntilTick: 0,
      touchedEmptyCore: false,
      goal: "core",
    });
  }
  return { ...state, enemies, pendingSpawns, seed, nextId };
}

export function enemyGoal(state: IMatchState, enemy: IEnemyState): TEnemyGoal {
  if (enemy.carrying !== null) return "exit";
  if (filesInCore(state) > 0) return "core";
  if (state.files.some((file) => file.status === "dropped")) return "file";
  return enemy.touchedEmptyCore ? "exit" : "core";
}

export function goalField(state: IMatchState, enemy: IEnemyState): Float64Array {
  const goal = enemyGoal(state, enemy);
  if (goal === "core") return state.fields.toCore;
  if (goal === "exit") return state.fields.toExit;
  const index = cellIndex(state.grid, cellOf(enemy.pos));
  let closest = state.fields.toCore;
  let distance = Infinity;
  let id = Infinity;
  for (const file of state.files) {
    if (file.status !== "dropped") continue;
    const field = state.fields.toFile[file.id];
    if (!field) continue;
    const candidate = field[index] ?? Infinity;
    if (candidate < distance || (candidate === distance && file.id < id)) {
      closest = field;
      distance = candidate;
      id = file.id;
    }
  }
  return closest;
}

export function stepEnemies(state: IMatchState): IMatchState {
  let files = state.files;
  let fields = state.fields;
  let events = state.events;
  const enemies: IEnemyState[] = [];
  for (const enemy of [...state.enemies].sort((a, b) => a.id - b.id)) {
    const current = { ...state, files, fields };
    const goal = enemyGoal(current, enemy);
    const field = goalField(current, enemy);
    const target =
      nextWaypoint(
        state.grid,
        field,
        enemy.pos,
        enemyStats(enemy).radius,
        enemy.offset,
        goal === "core" ? state.grid.core : null,
      ) ??
      (goal === "exit"
        ? state.options.map.ports
            .flatMap((port) => portCells(state.options.map, port))
            .filter(
              (cell) => cellIndex(state.grid, cell) === cellIndex(state.grid, cellOf(enemy.pos)),
            )
            .map((cell) => ({ x: cellCenter(cell.c), y: cellCenter(cell.r) }))[0]
        : goal === "file"
          ? files.find((file) => file.status === "dropped" && fields.toFile[file.id] === field)?.pos
          : null);
    const motion = target
      ? moveToward(
          enemy.pos,
          enemy.heading,
          target,
          enemyStats(enemy).speed * CELL,
          balance.movement.turnRateDeg,
          TICK_S,
        )
      : { pos: enemy.pos, heading: enemy.heading };
    const pos = resolveCollision(state.grid, motion.pos, enemyStats(enemy).radius);
    let updated: IEnemyState = { ...enemy, pos, heading: motion.heading, goal };

    if (
      updated.carrying === null &&
      discTouchesRect(motion.pos, enemyStats(enemy).radius, coreRect(state.options.map))
    ) {
      const file = files.filter((item) => item.status === "core").sort((a, b) => a.id - b.id)[0];
      if (file) {
        files = files.map((item) =>
          item.id === file.id
            ? ({ ...item, status: "carried", carrierId: enemy.id } as const)
            : item,
        );
        updated = { ...updated, carrying: file.id, goal: "exit" };
        events = [...events, { kind: "stolen", filesInCore: filesInCore({ ...state, files }) }];
      } else updated = { ...updated, touchedEmptyCore: true };
    }
    if (updated.carrying === null) {
      const file = files
        .filter(
          (item) =>
            item.status === "dropped" &&
            item.pos &&
            Math.hypot(item.pos.x - pos.x, item.pos.y - pos.y) <=
              enemyStats(enemy).radius + balance.files.radius,
        )
        .sort((a, b) => a.id - b.id)[0];
      if (file) {
        files = files.map((item) =>
          item.id === file.id
            ? ({ ...item, status: "carried", carrierId: enemy.id, pos: null } as const)
            : item,
        );
        const toFile = { ...fields.toFile };
        delete toFile[file.id];
        fields = { ...fields, toFile };
        updated = { ...updated, carrying: file.id, goal: "exit" };
      }
    }
    const atExit = state.options.map.ports.some((port) =>
      portCells(state.options.map, port).some(
        (cell) =>
          Math.hypot(pos.x - cellCenter(cell.c), pos.y - cellCenter(cell.r)) <=
          balance.movement.arrive,
      ),
    );
    if (atExit && updated.carrying !== null) {
      const carriedId = updated.carrying;
      files = files.map((file) =>
        file.id === carriedId
          ? ({ ...file, status: "leaked", carrierId: null, pos: null } as const)
          : file,
      );
      events = [
        ...events,
        {
          kind: "leaked",
          leaked: files.filter((file) => file.status === "leaked").length,
          total: files.length,
        },
      ];
    } else if (!atExit || (updated.carrying === null && goal !== "exit")) enemies.push(updated);
  }
  return { ...state, enemies, files, fields, events };
}
