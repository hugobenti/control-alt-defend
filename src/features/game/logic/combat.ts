import { balance, TICK_S } from "./balance.data";
import { effectiveStats } from "./boost";
import { enemyStats } from "./enemyStats";
import { dropFile } from "./files";
import { CELL, cellCenter } from "./geometry";
import { cellIndex, cellOf } from "./grid";
import type { IPoint } from "./grid.type";
import type { IEnemyState, IMatchState, ITowerState } from "./match.type";
import { randomRange } from "./rng";
import { resolveCollision } from "./steering";

export function remainingPath(state: IMatchState, enemy: IEnemyState): number {
  const index = cellIndex(state.grid, cellOf(enemy.pos));
  return (enemy.carrying !== null ? state.fields.toExit : state.fields.toCore)[index] ?? Infinity;
}

function inRange(tower: ITowerState, enemy: IEnemyState, rangeCells: number): boolean {
  const dx = enemy.pos.x - cellCenter(tower.c);
  const dy = enemy.pos.y - cellCenter(tower.r);
  return dx * dx + dy * dy <= (rangeCells * CELL) ** 2;
}

export function pickTarget(
  state: IMatchState,
  tower: ITowerState,
  rangeCells: number,
): IEnemyState | null {
  let selected: IEnemyState | null = null;
  let path = Infinity;
  for (const enemy of state.enemies) {
    if (enemy.health <= 0 || !inRange(tower, enemy, rangeCells)) continue;
    const remaining = remainingPath(state, enemy);
    if (
      !selected ||
      (enemy.carrying !== null && selected.carrying === null) ||
      ((enemy.carrying !== null) === (selected.carrying !== null) &&
        (remaining < path || (remaining === path && enemy.id < selected.id)))
    ) {
      selected = enemy;
      path = remaining;
    }
  }
  return selected;
}

export function applyHit(enemy: IEnemyState, damage: number, tick: number): IEnemyState {
  return {
    ...enemy,
    health: enemy.health - Math.max(1, damage - enemyStats(enemy).armor),
    hitUntilTick: tick + balance.movement.hitTicks,
  };
}

export function stepCombat(state: IMatchState): IMatchState {
  const enemies = [...state.enemies];
  const lastHit = new Map<number, number>();
  const towers: ITowerState[] = [];
  const beams: IMatchState["beams"] = [];
  const shots = state.shots.filter((shot) => shot.untilTick > state.tick);
  for (const tower of state.towers) {
    if (tower.type === "firewall") {
      towers.push(tower);
      continue;
    }
    const { damage, rate, range } = effectiveStats(state.towers, tower);
    const current = { ...state, enemies };
    const from: IPoint = { x: cellCenter(tower.c), y: cellCenter(tower.r) };
    const hit = (target: IEnemyState, amount: number) => {
      const index = enemies.findIndex((enemy) => enemy.id === target.id);
      enemies[index] = applyHit(enemies[index]!, amount, state.tick);
      lastHit.set(target.id, tower.id);
    };
    if (tower.type === "antivirus") {
      const cooldownTicks = Math.max(0, tower.cooldownTicks - 1);
      if (cooldownTicks > 0) {
        towers.push({ ...tower, cooldownTicks });
        continue;
      }
      const target = pickTarget(current, tower, range);
      if (!target) {
        towers.push({ ...tower, cooldownTicks: 0 });
        continue;
      }
      hit(target, damage);
      const shotTicks = Math.max(
        2,
        Math.ceil(
          Math.hypot(target.pos.x - from.x, target.pos.y - from.y) /
            (balance.movement.shotSpeed * TICK_S),
        ),
      );
      const arriveTick = state.tick + shotTicks;
      shots.push({
        from,
        to: target.pos,
        firedTick: state.tick,
        arriveTick,
        untilTick: arriveTick + balance.movement.impactTicks,
      });
      towers.push({ ...tower, cooldownTicks: Math.round(60 / rate), aimAt: target.pos });
      if (tower.version === 3) {
        const dx = target.pos.x - from.x;
        const dy = target.pos.y - from.y;
        const length = Math.hypot(dx, dy);
        const reach = balance.towers.antivirus.pierceReach * CELL;
        let other: IEnemyState | null = null;
        for (const enemy of enemies) {
          if (enemy.id === target.id || enemy.health <= 0) continue;
          const along = ((enemy.pos.x - from.x) * dx + (enemy.pos.y - from.y) * dy) / length;
          const sideways =
            Math.abs((enemy.pos.x - from.x) * dy - (enemy.pos.y - from.y) * dx) / length;
          if (
            along > length &&
            along <= length + reach &&
            sideways <= enemyStats(enemy).radius &&
            (!other || enemy.id < other.id)
          ) {
            other = enemy;
          }
        }
        if (other) hit(other, damage);
      }
      continue;
    }
    const held = enemies.find(
      (enemy) =>
        enemy.id === tower.beamTargetId && enemy.health > 0 && inRange(tower, enemy, range),
    );
    const target = held ?? pickTarget(current, tower, range);
    if (!target) {
      towers.push({ ...tower, beamTargetId: null, beamTicks: 0 });
      continue;
    }
    const beamTicks = held ? tower.beamTicks + 1 : 0;
    const ramp = Math.min((beamTicks * TICK_S) / balance.towers.debugger.rampSeconds, 1);
    let chainTo: IPoint | null = null;
    if (beamTicks % Math.round(60 / rate) === 0) {
      const pulse = damage * (1 + (balance.towers.debugger.rampMax - 1) * ramp);
      hit(target, pulse);
      if (tower.version === 3) {
        const reachSquared = (balance.towers.debugger.chainReach * CELL) ** 2;
        let closest = Infinity;
        let chained: IEnemyState | null = null;
        for (const enemy of enemies) {
          if (enemy.id === target.id || enemy.health <= 0) continue;
          const distance = (enemy.pos.x - target.pos.x) ** 2 + (enemy.pos.y - target.pos.y) ** 2;
          if (
            distance <= reachSquared &&
            (distance < closest || (distance === closest && enemy.id < chained!.id))
          ) {
            closest = distance;
            chained = enemy;
          }
        }
        if (chained) {
          chainTo = chained.pos;
          hit(chained, pulse * balance.towers.debugger.chainFactor);
        }
      }
    }
    beams.push({ from, to: target.pos, ramp, chainTo });
    towers.push({ ...tower, beamTargetId: target.id, beamTicks, aimAt: target.pos });
  }

  let next: IMatchState = { ...state, enemies: [], towers, beams, shots };
  let seed = state.seed;
  let nextId = state.nextId;
  const dead = enemies.filter((enemy) => enemy.health <= 0).sort((a, b) => a.id - b.id);
  next.enemies = enemies.filter((enemy) => enemy.health > 0);
  for (const enemy of dead) {
    const reward = enemyStats(enemy).reward;
    next = {
      ...next,
      bits: next.bits + reward,
      events: [...next.events, { kind: "killed", type: enemy.type, reward }],
      towers: next.towers.map((tower) =>
        tower.id === lastHit.get(enemy.id) ? { ...tower, kills: tower.kills + 1 } : tower,
      ),
    };
    if (enemy.carrying !== null) {
      const pos = resolveCollision(next.grid, enemy.pos, balance.files.radius);
      next = dropFile(next, { ...enemy, pos });
    }
    if (enemy.type === "worm" && !enemy.small) {
      const angle = (enemy.heading * Math.PI) / 180;
      const dx = -Math.sin(angle) * balance.movement.splitOffset;
      const dy = Math.cos(angle) * balance.movement.splitOffset;
      for (const sign of [1, -1]) {
        const x = randomRange(seed, -balance.movement.offsetMax, balance.movement.offsetMax);
        const y = randomRange(x.seed, -balance.movement.offsetMax, balance.movement.offsetMax);
        seed = y.seed;
        next.enemies.push({
          id: nextId++,
          type: "worm",
          small: true,
          pos: resolveCollision(
            next.grid,
            { x: enemy.pos.x + sign * dx, y: enemy.pos.y + sign * dy },
            balance.enemies.wormSmall.radius,
          ),
          heading: enemy.heading,
          health: balance.enemies.wormSmall.health,
          maxHealth: balance.enemies.wormSmall.health,
          carrying: null,
          touchedEmptyCore: false,
          offset: { x: x.value, y: y.value },
          hitUntilTick: 0,
        });
      }
    }
  }
  if (dead.length) {
    const deadIds = new Set(dead.map((enemy) => enemy.id));
    next = {
      ...next,
      towers: next.towers.map((tower) =>
        tower.beamTargetId !== null && deadIds.has(tower.beamTargetId)
          ? { ...tower, beamTargetId: null, beamTicks: 0 }
          : tower,
      ),
    };
  }
  return { ...next, seed, nextId };
}
