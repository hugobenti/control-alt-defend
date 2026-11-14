export interface IPort {
  id: string;
  side: "left" | "right" | "top" | "bottom";
  start: number;
}

export interface IObstacle {
  kind: "chip" | "capacitor" | "resistor" | "crystal";
  c: number;
  r: number;
  w: number;
  h: number;
  label: string;
  text?: string;
}

export interface ITrace {
  d: string;
  vias: [number, number][];
}

export interface ILevelMap {
  cols: number;
  rows: number;
  core: { c: number; r: number };
  ports: IPort[];
  obstacles: IObstacle[];
  traces: ITrace[];
}
