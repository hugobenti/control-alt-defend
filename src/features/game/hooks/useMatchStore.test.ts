import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";

import { homePc } from "../level/homePc.data";
import { createMatch } from "../logic/match";
import { createMatchStore } from "./matchStore";
import { useMatchStore } from "./useMatchStore";

it("subscribes React to the latest immutable match snapshot", () => {
  const store = createMatchStore(createMatch({ map: homePc, seed: 1, startBits: 1000, files: 8 }));
  const { result } = renderHook(() => useMatchStore(store));
  expect(result.current.tick).toBe(0);
  act(() => store.advance(2));
  expect(result.current.tick).toBe(2);
});
