import { useEffect, useRef } from "react";
import { moveBoardCursor } from "../../logic/geometry";

import type { IMatchKeyHandlers } from "./SandboxScreen.type";

export function useMatchKeys(
  handlers: IMatchKeyHandlers,
  boardRef: React.RefObject<HTMLDivElement | null>,
): void {
  const latest = useRef(handlers);
  useEffect(() => {
    latest.current = handlers;
  });
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const current = latest.current;
      if (current.over || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof Element && target.closest('[role="dialog"]')) return;
      const onBoard = target === boardRef.current;
      switch (event.key) {
        case "ArrowUp":
          current.moveCursor(moveBoardCursor(current.cursor, 0, -1, current.map));
          break;
        case "ArrowDown":
          current.moveCursor(moveBoardCursor(current.cursor, 0, 1, current.map));
          break;
        case "ArrowLeft":
          current.moveCursor(moveBoardCursor(current.cursor, -1, 0, current.map));
          break;
        case "ArrowRight":
          current.moveCursor(moveBoardCursor(current.cursor, 1, 0, current.map));
          break;
        case "1":
          current.pickTower("firewall");
          break;
        case "2":
          current.pickTower("antivirus");
          break;
        case "3":
          current.pickTower("debugger");
          break;
        case "Escape":
          if (current.settingsOpen) current.closeSettings();
          else current.cancel();
          break;
        case "u":
        case "U":
          current.upgrade();
          break;
        case "s":
        case "S":
          current.sell();
          break;
        case "f":
        case "F":
          current.toggleSpeed();
          break;
        case "w":
        case "W":
          current.spawn("worm");
          break;
        case "r":
        case "R":
          current.spawn("rootkit");
          break;
        case "b":
        case "B":
          current.grantBits();
          break;
        case "Enter":
          if (onBoard) current.activate();
          break;
        case " ":
          if (onBoard || target === document.body) current.togglePause();
          break;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [boardRef]);
}
