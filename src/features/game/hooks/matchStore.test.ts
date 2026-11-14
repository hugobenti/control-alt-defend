import { describe, expect, it, vi } from "vitest";

import { homePc } from "../level/homePc.data";
import { createMatch } from "../logic/match";
import { createMatchStore } from "./matchStore";

const initial = () => createMatch({ map: homePc, seed: 1, startBits: 1000, files: 8 });

describe("match store", () => {
  it("advances three ticks with one notification and leaves the initial state unchanged", () => {
    const state = initial();
    const store = createMatchStore(state);
    const listener = vi.fn();
    store.subscribe(listener);
    store.advance(3);
    expect(store.getState().tick).toBe(3);
    expect(state.tick).toBe(0);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("notifies once per command and stops notifying unsubscribed listeners", () => {
    const store = createMatchStore(initial());
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.dispatch({ kind: "grantBits" });
    expect(store.getState().bits).toBe(2000);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.dispatch({ kind: "grantBits" });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not notify for zero ticks", () => {
    const store = createMatchStore(initial());
    const listener = vi.fn();
    store.subscribe(listener);
    store.advance(0);
    expect(listener).not.toHaveBeenCalled();
  });
});
