import { useRef } from "react";

import { pointToCell } from "../../logic/geometry";
import type { IBoardInput, IBoardInputHandlers } from "./SandboxScreen.type";

export function useBoardInput({
  map,
  onCell,
  onActivate,
  onCancel,
}: IBoardInputHandlers): IBoardInput {
  const ref = useRef<HTMLDivElement>(null);
  return {
    ref,
    onPointerMove(event) {
      const cell = pointToCell(
        event.clientX,
        event.clientY,
        event.currentTarget.getBoundingClientRect(),
        map,
      );
      if (cell) onCell(cell);
    },
    onClick(event) {
      const cell = pointToCell(
        event.clientX,
        event.clientY,
        event.currentTarget.getBoundingClientRect(),
        map,
      );
      if (cell) onActivate(cell);
    },
    onContextMenu(event) {
      event.preventDefault();
      onCancel();
    },
  };
}
