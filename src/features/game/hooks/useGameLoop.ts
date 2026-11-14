import { useEffect, useRef } from "react";

import { ticksToRun } from "../logic/gameLoop";
import type { IMatchStore } from "./matchStore.type";

export function useGameLoop(store: IMatchStore, running: boolean, speed: 1 | 2): void {
  const accumulator = useRef(0);
  const lastTimestamp = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      lastTimestamp.current = null;
      accumulator.current = 0;
      return;
    }
    let frameId: number;
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") lastTimestamp.current = null;
    };
    const frame = (timestamp: number) => {
      if (lastTimestamp.current !== null && document.visibilityState !== "hidden") {
        const next = ticksToRun(
          accumulator.current,
          (timestamp - lastTimestamp.current) / 1000,
          speed,
        );
        accumulator.current = next.rest;
        if (next.ticks) store.advance(next.ticks);
      }
      lastTimestamp.current = timestamp;
      frameId = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    frameId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      lastTimestamp.current = null;
    };
  }, [store, running, speed]);
}
