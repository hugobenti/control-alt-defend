import { game } from "@/content/game";

import { countFiles } from "../../logic/matchHud";
import type { TGameSpeed } from "../SettingsMenu/SettingsMenu.type";
import type { IMatchHeaderProps } from "./MatchHeader.type";

const SPEEDS: TGameSpeed[] = ["1", "2"];

export function useMatchHeader({
  level,
  wave,
  files,
  bits,
  paused,
  sound,
  settingsOpen,
  onPausedChange,
  onSoundChange,
  onSettingsOpenChange,
}: IMatchHeaderProps) {
  const copy = game.header;
  const counts = countFiles(files);
  return {
    label: copy.label,
    brand: copy.brand,
    levelPrefix: copy.level(level.number),
    levelTitle: `${copy.level(level.number)}${level.name}`,
    pausedLabel: copy.paused,
    waveLabel: copy.wave,
    waveValue: String(wave.current),
    waveTotal: String(wave.total),
    filesLabel: copy.files,
    filesValue: String(counts.notLeaked),
    filesTotal: String(counts.total),
    fileSummary: game.files.summary(counts.byState),
    bitsLabel: copy.bits,
    bitsText: String(bits),
    pauseLabel: paused ? copy.controls.resume : copy.controls.pause,
    pauseIcon: paused ? ("play" as const) : ("pause" as const),
    speedLabel: copy.controls.speed,
    speedOptions: SPEEDS.map((value) => ({ value, text: copy.controls.speeds[value] })),
    soundLabel: copy.controls.sound,
    soundIcon: sound ? ("sound" as const) : ("sound-off" as const),
    settingsLabel: copy.controls.settings,
    togglePause: () => onPausedChange(!paused),
    toggleSound: () => onSoundChange(!sound),
    toggleSettings: () => onSettingsOpenChange(!settingsOpen),
    closeSettings: () => onSettingsOpenChange(false),
  };
}
