import type { TFileState } from "../FilePips/FilePips.type";
import type { INextWaveProps } from "../NextWave/NextWave.type";
import type { TGameSpeed } from "../SettingsMenu/SettingsMenu.type";

export interface IMatchHeaderProps {
  level: { number: number; name: string };
  wave: { current: number; total: number };
  nextWave: Omit<INextWaveProps, "wave" | "onStartNow" | "className">;
  files: TFileState[];
  bits: number;
  paused: boolean;
  speed: TGameSpeed;
  defaultSpeed: TGameSpeed;
  sound: boolean;
  settingsOpen: boolean;
  onPausedChange: (paused: boolean) => void;
  onSpeedChange: (speed: TGameSpeed) => void;
  onSoundChange: (sound: boolean) => void;
  onSettingsOpenChange: (open: boolean) => void;
  onDefaultSpeedChange: (speed: TGameSpeed) => void;
  onStartNow: () => void;
  onRestart: () => void;
  onQuit: () => void;
  className?: string;
}
