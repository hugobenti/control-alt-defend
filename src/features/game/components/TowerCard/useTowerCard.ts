import { useId } from "react";

import { game } from "@/content/game";

import type { ITowerCardProps } from "./TowerCard.type";

export function useTowerCard({ type, version, stats, upgrade, sellRefund }: ITowerCardProps) {
  const id = useId();
  const { state, cost = 0, missingBits = 0, nextVersion = 1, adds } = upgrade;
  const upgradeName = game.card.upgradeTo(nextVersion);
  const canUpgrade = state === "available" || state === "poor";
  return {
    nameId: `${id}-name`,
    reasonId: `${id}-reason`,
    name: game.towerNames[type],
    role: game.towerRoles[type],
    versionLabel: game.card.version(version),
    rows: stats.map(({ label, value, next, tone }) => ({
      label,
      value,
      tone,
      next: next === undefined ? undefined : game.card.next(next),
    })),
    nextVersionLabel: game.card.version(nextVersion),
    adds,
    showIntro: canUpgrade && adds !== undefined,
    canUpgrade,
    upgradeDisabled: state === "poor",
    upgradeDescribedBy: state === "poor" ? `${id}-reason` : undefined,
    /** The one visible text of the button; it is also its accessible name. */
    upgradeText:
      state === "available" ? game.card.withCost(upgradeName, cost) : game.needBits(missingBits),
    showMessage: state === "locked" || state === "max",
    messageIcon: state === "max" ? ("check" as const) : ("lock" as const),
    messageTitle: state === "locked" ? game.card.locked(nextVersion) : undefined,
    messageText: state === "locked" ? game.card.lockedHint : game.card.max,
    upgradeShortcut: state === "poor" ? undefined : game.card.upgradeKey,
    sellShortcut: game.card.sellKey,
    sellLabel: game.card.sell,
    sellText: game.card.sellRefund(sellRefund),
  };
}
