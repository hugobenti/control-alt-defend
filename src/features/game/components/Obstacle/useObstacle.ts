import { CELL, cellOrigin } from "../../logic/geometry";
import type { IObstacleProps } from "./Obstacle.type";

export function useObstacle({ c, r, w, h, kind }: IObstacleProps["obstacle"]) {
  const width = w * CELL;
  const height = h * CELL;
  const legCount = Math.round(width / 10);
  return {
    transform: `translate(${cellOrigin(c)} ${cellOrigin(r)})`,
    width,
    height,
    chipWidth: width - 6,
    chipHeight: height - 12,
    chipTextX: width / 2,
    chipTextY: height / 2 + 4,
    crystalWidth: width - 8,
    crystalInsetWidth: width - 20,
    resistorEndX: width - 10,
    resistorWidth: width - 18,
    capacitors:
      kind === "capacitor"
        ? Array.from({ length: Math.max(w, h) }, (_, i) => {
            const x = CELL / 2 + (w > 1 ? i * CELL : 0);
            const y = CELL / 2 + (h > 1 ? i * CELL : 0);
            return { x, y, transform: `translate(${x} ${y})` };
          })
        : [],
    capacitorLabel:
      w > 1 || h > 1 ? { x: w > 1 ? 2 : width + 4, y: h > 1 ? 24 : height + 14 } : { x: 2, y: -4 },
    legs:
      kind === "chip"
        ? Array.from({ length: legCount }, (_, i) => ({
            x: 4 + i * ((width - 12) / (legCount - 1)),
            bottom: height - 7,
          }))
        : [],
    bands: kind === "resistor" ? [22, 32, 42] : [],
  };
}
