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
