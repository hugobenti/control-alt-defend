export type TIconName =
  | "pause"
  | "play"
  | "sound"
  | "sound-off"
  | "gear"
  | "lock"
  | "bits"
  | "block"
  | "check"
  | "forward";

export interface IIconProps {
  name: TIconName;
  className?: string;
}
