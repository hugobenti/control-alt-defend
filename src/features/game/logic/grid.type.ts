export interface ICell {
  c: number;
  r: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IGrid {
  cols: number;
  rows: number;
  blocked: Uint8Array;
  keepOut: Uint8Array;
  core: Uint8Array;
}
