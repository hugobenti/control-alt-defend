import { game } from "@/content/game";

import type { TGameSpeed } from "./SettingsMenu.type";

const SPEEDS: TGameSpeed[] = ["1", "2"];

export function useSettingsMenu() {
  const copy = game.header.settings;
  return {
    ...copy,
    speedLabel: game.header.controls.speed,
    speedOptions: SPEEDS.map((value) => ({ value, text: game.header.controls.speeds[value] })),
  };
}
