import { game } from "@/content/game";

import type { TGameSpeed } from "./SettingsMenu.type";

const SPEEDS: TGameSpeed[] = ["1", "2"];

export function useSettingsMenu() {
  const copy = game.header.settings;
  return {
    title: copy.title,
    sound: copy.sound,
    defaultSpeed: copy.defaultSpeed,
    restart: copy.restart,
    quit: copy.quit,
    speedOptions: SPEEDS.map((value) => ({ value, text: game.header.controls.speeds[value] })),
  };
}
