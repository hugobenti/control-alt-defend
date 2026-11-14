export type TGameSpeed = "1" | "2";

export interface ISettingsMenuProps {
  open: boolean;
  onClose: () => void;
  sound: boolean;
  defaultSpeed: TGameSpeed;
  onSoundChange: (sound: boolean) => void;
  onDefaultSpeedChange: (speed: TGameSpeed) => void;
  onRestart: () => void;
  onQuit: () => void;
  className?: string;
}
