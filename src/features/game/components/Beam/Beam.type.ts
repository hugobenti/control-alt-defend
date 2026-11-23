import type { IShotProps } from "../Shot/Shot.type";

export interface IBeamProps extends Pick<IShotProps, "from" | "to"> {
  ramp: number;
}
