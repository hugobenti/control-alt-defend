import type { TTowerType } from "../components/Tower/Tower.type";
import type { ICell } from "./grid.type";

export function boardHover(
  towers: readonly ICell[],
  cell: ICell,
  placing: TTowerType | null,
  modality: "pointer" | "keyboard",
  pointerInside: boolean,
) {
  const keyboard = modality === "keyboard";
  const showPlacement = placing !== null && (keyboard || pointerInside);
  const actionable =
    !keyboard &&
    pointerInside &&
    placing === null &&
    towers.some((tower) => tower.c === cell.c && tower.r === cell.r);
  return {
    showCursor: keyboard || actionable,
    showPlacement,
    actionable,
  };
}
