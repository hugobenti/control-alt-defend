import type { ILevelMap, ITrace } from "./level.type";

export const homePc: ILevelMap = {
  cols: 24,
  rows: 16,
  core: { c: 11, r: 7 },
  ports: [
    { id: "J1", side: "left", start: 2 },
    { id: "J2", side: "right", start: 12 },
  ],
  obstacles: [
    { kind: "chip", c: 4, r: 9, w: 3, h: 2, label: "U1", text: "BIOS" },
    { kind: "chip", c: 16, r: 2, w: 2, h: 2, label: "U2", text: "RAM" },
    { kind: "capacitor", c: 8, r: 3, w: 1, h: 1, label: "C1" },
    { kind: "capacitor", c: 20, r: 7, w: 1, h: 1, label: "C2" },
    { kind: "resistor", c: 18, r: 14, w: 2, h: 1, label: "R1" },
    { kind: "crystal", c: 5, r: 13, w: 2, h: 1, label: "Y1" },
    { kind: "chip", c: 10, r: 12, w: 2, h: 3, label: "U3", text: "NET" },
  ],
  traces: [
    { d: "M440 296 H412 L372 256 V180 L332 140 H250", vias: [[250, 140]] },
    { d: "M440 344 H404 L344 404 V470 L304 510 H150", vias: [[150, 510]] },
    { d: "M520 296 H556 L596 256 V196 L626 166", vias: [[626, 166]] },
    { d: "M520 344 H584 L644 404 H760 L800 364 V300", vias: [[800, 300]] },
    { d: "M496 280 V220 L536 180 V60 L576 20 H700", vias: [[700, 20]] },
    { d: "M464 360 V420 L424 460 V600", vias: [[424, 600]] },
    { d: "M504 360 V420 L544 460 H690 L720 430", vias: [[720, 430]] },
    {
      d: "M80 560 H240 L280 600 H380",
      vias: [
        [80, 560],
        [380, 600],
      ],
    },
  ] satisfies ITrace[],
};
