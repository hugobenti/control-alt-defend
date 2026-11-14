import { game } from "../../../content/game";
import type { IBuildItemProps } from "../components/BuildItem/BuildItem.type";
import type { ITowerCardProps, ITowerCardStat } from "../components/TowerCard/TowerCard.type";
import type { TTowerType, TVersion } from "../components/Tower/Tower.type";
import { balance } from "./balance.data";
import { boostEdges, boostFor, effectiveStats } from "./boost";
import { buildCost, sellRefund, upgradeCost } from "./economy";
import type { IMatchState, ITowerState } from "./match.type";
import type { IBoardUi, IBoardView } from "./matchView.type";
import { checkPlacement, routePreview } from "./placement";

export function buildBoardView(state: IMatchState, ui: IBoardUi): IBoardView {
  const dropped = state.files.filter((file) => file.status === "dropped" && file.pos !== null);
  const droppedFiles = dropped.map((file) => ({ id: file.id, x: file.pos!.x, y: file.pos!.y }));
  const placement =
    ui.placing === null
      ? null
      : checkPlacement({
          map: state.options.map,
          grid: state.grid,
          cell: ui.cursor,
          enemies: state.enemies.map((enemy) => ({
            pos: enemy.pos,
            radius: enemy.small
              ? balance.enemies.wormSmall.radius
              : balance.enemies[enemy.type].radius,
          })),
          droppedFiles: dropped.map((file) => file.pos!),
          bits: state.bits,
          cost: buildCost(ui.placing),
        });
  const ghost =
    ui.placing === null
      ? null
      : {
          type: ui.placing,
          ...ui.cursor,
          valid: placement === null,
          ...(placement === null ? {} : { reason: game.placement.reasons[placement] }),
        };
  const selected = state.towers.find((tower) => tower.id === ui.selectedTowerId);
  const rangeTower: ITowerState | undefined =
    ui.placing && ui.placing !== "firewall"
      ? {
          id: -1,
          type: ui.placing,
          version: 1,
          ...ui.cursor,
          spent: 0,
          cooldownTicks: 0,
          beamTargetId: null,
          beamTicks: 0,
          kills: 0,
          aimAt: null,
        }
      : selected?.type !== "firewall"
        ? selected
        : undefined;
  const rangeRing = rangeTower
    ? {
        type: rangeTower.type,
        c: rangeTower.c,
        r: rangeTower.r,
        range: effectiveStats(state.towers, rangeTower).range,
      }
    : null;
  return {
    towers: state.towers.map((tower) => ({
      type: tower.type,
      version: tower.version,
      c: tower.c,
      r: tower.r,
      aimAt: tower.aimAt ?? undefined,
      boosted: boostFor(state.towers, tower) !== null,
      selected: tower.id === ui.selectedTowerId,
    })),
    enemies: state.enemies.map((enemy) => ({
      id: enemy.id,
      type: enemy.type,
      x: enemy.pos.x,
      y: enemy.pos.y,
      heading: enemy.heading,
      health: enemy.health / enemy.maxHealth,
      hit: state.tick < enemy.hitUntilTick,
      small: enemy.small,
      carrier: enemy.carrying !== null,
    })),
    shots: state.shots
      .filter((shot) => state.tick < shot.untilTick)
      .map(({ from, to }) => ({ from, to })),
    beams: state.beams.flatMap(({ from, to, chainTo, ramp }) =>
      chainTo === null
        ? [{ from, to, ramp }]
        : [
            { from, to, ramp },
            { from: to, to: chainTo, ramp },
          ],
    ),
    boostEdges: boostEdges(state.towers),
    droppedFiles,
    rangeRing,
    ghost,
    routePreview:
      ui.placing !== null && placement === null
        ? routePreview(state.options.map, state.grid, ui.cursor)
        : [],
    files: state.files.length,
    filesInCore: state.files.filter((file) => file.status === "core").length,
  };
}

const buildTypes: TTowerType[] = ["firewall", "antivirus", "debugger"];

export function buildBuildItems(state: IMatchState, placing: TTowerType | null): IBuildItemProps[] {
  return buildTypes.map((type, index) => {
    const cost = buildCost(type);
    return {
      type,
      cost,
      shortcut: String(index + 1),
      state: placing === type ? "placing" : state.bits < cost ? "poor" : "available",
      ...(state.bits < cost ? { missingBits: cost - state.bits } : {}),
    };
  });
}

export function buildTowerCard(
  state: IMatchState,
  towerId: number,
): Omit<ITowerCardProps, "onUpgrade" | "onSell"> | null {
  const tower = state.towers.find((candidate) => candidate.id === towerId);
  if (!tower) return null;
  const nextVersion = tower.version === 3 ? null : ((tower.version + 1) as TVersion);
  const cost = upgradeCost(tower.type, tower.version);
  const stats = effectiveStats(state.towers, tower);
  const nextStats =
    nextVersion === null ? null : effectiveStats(state.towers, { ...tower, version: nextVersion });
  const rows: ITowerCardStat[] = [];
  const boost = boostFor(state.towers, tower);
  if (tower.type === "firewall") {
    rows.push({
      label: game.card.boostOwn,
      value:
        tower.version === 1
          ? game.card.stats.boostNone
          : tower.version === 2
            ? game.card.stats.boostV2
            : game.card.stats.boostV3,
      ...(nextVersion
        ? { next: nextVersion === 2 ? game.card.stats.boostV2 : game.card.stats.boostV3 }
        : {}),
    });
    rows.push({
      label: game.card.boostingLabel,
      value: game.card.boosting(
        state.towers.filter((other) => {
          const source = boostFor(state.towers, other)?.from;
          return source?.c === tower.c && source.r === tower.r;
        }).length,
      ),
    });
  } else {
    rows.push({
      label: game.card.stats.damage,
      value: String(stats.damage),
      ...(nextStats ? { next: String(nextStats.damage) } : {}),
    });
    if (tower.type === "antivirus") {
      rows.push({
        label: game.card.stats.fireRate,
        value: game.card.perSecond(stats.rate),
        ...(nextStats ? { next: game.card.perSecond(nextStats.rate) } : {}),
      });
    } else {
      rows.push({
        label: game.card.stats.pulse,
        value: game.card.pulseValue(stats.damage, stats.rate),
        ...(nextStats ? { next: game.card.pulseValue(nextStats.damage, nextStats.rate) } : {}),
      });
    }
    rows.push({
      label: game.card.stats.range,
      value: stats.range.toFixed(1),
      ...(nextStats ? { next: nextStats.range.toFixed(1) } : {}),
    });
    if (boost)
      rows.push({
        label: game.card.boost,
        value: boost.version === 2 ? game.card.stats.boostV2 : game.card.stats.boostV3,
        tone: "boost",
      });
    rows.push({ label: game.card.stats.targets, value: game.card.targetsValue });
    rows.push({ label: game.card.stats.kills, value: String(tower.kills) });
  }
  return {
    type: tower.type,
    version: tower.version,
    stats: rows,
    upgrade:
      cost === null
        ? { state: "max" }
        : {
            state: state.bits >= cost ? "available" : "poor",
            cost,
            ...(state.bits < cost ? { missingBits: cost - state.bits } : {}),
            nextVersion: nextVersion!,
            adds: game.card.adds[tower.type],
          },
    sellRefund: sellRefund(tower.spent),
  };
}
