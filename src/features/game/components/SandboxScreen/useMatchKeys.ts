import { useEffect, useRef } from "react";

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
      current.onKeyboardInput();
      const onBoard = target === boardRef.current;
      switch (event.key) {
        case "ArrowUp":
          current.moveCursor({ ...current.cursor, r: Math.max(0, current.cursor.r - 1) });
          break;
        case "ArrowDown":
          current.moveCursor({
            ...current.cursor,
            r: Math.min(current.map.rows - 1, current.cursor.r + 1),
          });
          break;
        case "ArrowLeft":
          current.moveCursor({ ...current.cursor, c: Math.max(0, current.cursor.c - 1) });
          break;
        case "ArrowRight":
          current.moveCursor({
            ...current.cursor,
            c: Math.min(current.map.cols - 1, current.cursor.c + 1),
          });
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
