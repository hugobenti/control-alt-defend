import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { homePc } from "../../level/homePc.data";
import { createMatch } from "../../logic/match";
import { useSandboxScreen } from "./useSandboxScreen";

afterEach(() => vi.unstubAllGlobals());

function clock() {
  const callbacks = new Map<number, FrameRequestCallback>();
  let id = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callbacks.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (cancelId: number) => callbacks.delete(cancelId));
  return (time: number) => {
    const pending = [...callbacks.values()];
    callbacks.clear();
    pending.forEach((callback) => callback(time));
  };
}

const initial = () => createMatch({ map: homePc, seed: 1, startBits: 1000, files: 8 });

describe("useSandboxScreen", () => {
  it("builds, cancels, spawns, pauses and restarts", () => {
    const frame = clock();
    const { result } = renderHook(() => useSandboxScreen(initial()));
    expect(result.current.bits).toBe(1000);
    expect(result.current.files).toEqual(Array(8).fill("safe"));
    expect(result.current.cursor).toEqual({ c: 6, r: 6 });
    act(() => result.current.pickTower("antivirus"));
    act(() => result.current.activate());
    expect(result.current.boardView.towers).toHaveLength(1);
    expect(result.current.placing).toBe("antivirus");
    act(() => result.current.cancel());
    expect(result.current.placing).toBeNull();
    act(() => {
      result.current.spawn("worm");
      frame(0);
      frame(1000 / 60);
    });
    expect(result.current.boardView.enemies).toHaveLength(1);
    act(() => result.current.togglePause());
    const tick = result.current.tick;
    act(() => {
      frame(1000 / 30);
      frame(1000 / 20);
    });
    expect(result.current.tick).toBe(tick);
    act(() => result.current.setDefaultSpeed("2"));
    act(() => result.current.setSpeed("1"));
    expect(result.current.speed).toBe("1");
    act(() => result.current.restart());
    expect(result.current.bits).toBe(1000);
    expect(result.current.boardView.towers).toHaveLength(0);
    expect(result.current.paused).toBe(false);
    expect(result.current.speed).toBe(result.current.defaultSpeed);
    expect(result.current.speed).toBe("2");
  });

  it("announces refused placement without advancing the tick", () => {
    clock();
    const { result } = renderHook(() => useSandboxScreen(initial()));
    act(() => {
      result.current.pickTower("antivirus");
      result.current.moveCursor({ c: 0, r: 2 });
    });
    const tick = result.current.tick;
    act(() => result.current.activate());
    expect(result.current.tick).toBe(tick);
    expect(result.current.liveRegion.message).toBe("Can't build on ports, parts or the Core");
  });

  it("does not re-announce earlier refusals while paused or after a successful placement", () => {
    clock();
    const { result } = renderHook(() => useSandboxScreen(initial()));
    act(() => result.current.togglePause());
    act(() => result.current.pickTower("antivirus"));
    act(() => result.current.activate({ c: 0, r: 2 }));
    expect(result.current.liveRegion.message).toBe("Can't build on ports, parts or the Core");
    const firstSlot = result.current.liveRegion.slot;
    act(() => result.current.activate({ c: 0, r: 2 }));
    expect(result.current.liveRegion.message).toBe("Can't build on ports, parts or the Core");
    expect(result.current.liveRegion.slot).not.toBe(firstSlot);
    const secondSlot = result.current.liveRegion.slot;
    act(() => result.current.activate({ c: 6, r: 6 }));
    expect(result.current.boardView.towers).toHaveLength(1);
    expect(result.current.liveRegion.slot).toBe(secondSlot);
    expect(result.current.liveRegion.message).toBe("Can't build on ports, parts or the Core");
  });
});
