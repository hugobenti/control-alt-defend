"use client";

import { cx } from "@/features/shared/utils/cx";

import { DataCore } from "../DataCore/DataCore";
import { GameDefs } from "../GameDefs/GameDefs";
import { GameDefsContext, useGameDefsIds } from "../GameDefs/useGameDefs";
import { Obstacle } from "../Obstacle/Obstacle";
import { Port } from "../Port/Port";
import { board } from "./Board.style";
import type { IBoardProps } from "./Board.type";
import { useBoard } from "./useBoard";

export function Board({ map, children, className }: IBoardProps) {
  const ids = useGameDefsIds();
  const layout = useBoard(map, ids.dots);
  return (
    <GameDefsContext value={ids}>
      <svg
        role="img"
        aria-label={layout.label}
        viewBox={layout.viewBox}
        className={cx(board.base, className)}
      >
        <GameDefs ids={ids} />
        <rect {...layout.frame} rx="12" className={board.frame} aria-hidden="true" />
        <rect
          width={layout.width}
          height={layout.height}
          className={board.surface}
          aria-hidden="true"
        />
        <rect
          width={layout.width}
          height={layout.height}
          fill={layout.dotsFill}
          aria-hidden="true"
        />
        <g aria-hidden="true">
          {map.traces.map((trace) => (
            <g key={trace.d} data-trace>
              <path d={trace.d} className={board.trace} />
              {trace.vias.map(([x, y], index) => (
                <circle key={index} cx={x} cy={y} r="4.5" className={board.via} />
              ))}
            </g>
          ))}
        </g>
        <g aria-hidden="true">
          {map.obstacles.map((obstacle) => (
            <Obstacle key={obstacle.label} obstacle={obstacle} />
          ))}
        </g>
        <g aria-hidden="true">
          {map.ports.map((port) => (
            <Port key={port.id} port={port} cols={map.cols} rows={map.rows} />
          ))}
        </g>
        <DataCore x={layout.core.x} y={layout.core.y} files={8} filesInCore={8} />
        {children}
      </svg>
    </GameDefsContext>
  );
}
