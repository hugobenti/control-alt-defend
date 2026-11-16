import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { homePc } from "../level/homePc.data";
import { createMatch } from "../logic/match";
import { createMatchStore } from "./matchStore";
import { useGameLoop } from "./useGameLoop";

afterEach(() => vi.unstubAllGlobals());

function frameQueue() {
  const frames = new Map<number, FrameRequestCallback>();
  let nextId = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = ++nextId;
    frames.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  return {
    frames,
    fire(timestamp: number) {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback(timestamp));
    },
  };
}

const store = () =>
  createMatchStore(createMatch({ map: homePc, seed: 1, startBits: 1000, files: 8 }));

describe("useGameLoop", () => {
  it("runs two ticks for a 16.67 ms frame at 2×", () => {
    const clock = frameQueue();
    const match = store();
    const hook = renderHook(() => useGameLoop(match, true, 2));
    act(() => {
      clock.fire(0);
      clock.fire(1000 / 60);
    });
    expect(match.getState().tick).toBe(2);
    hook.unmount();
  });

  it("does not tick when paused and cancels a pending animation on unmount", () => {
    const clock = frameQueue();
    const match = store();
    const hook = renderHook(({ running }) => useGameLoop(match, running, 1), {
      initialProps: { running: false },
    });
    expect(clock.frames.size).toBe(0);
    expect(match.getState().tick).toBe(0);
    hook.rerender({ running: true });
    expect(clock.frames.size).toBe(1);
    hook.unmount();
    expect(clock.frames.size).toBe(0);
  });

  it("discards a hidden-tab gap on return to visibility", () => {
    const clock = frameQueue();
    const match = store();
    const hook = renderHook(() => useGameLoop(match, true, 1));
    act(() => {
      clock.fire(0);
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
      clock.fire(5000);
    });
    expect(match.getState().tick).toBe(0);
    hook.unmount();
  });
});
