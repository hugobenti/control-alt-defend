import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";

import { useLiveRegion } from "./useLiveRegion";

it("alternates slots even when the announcement text repeats", () => {
  const { result } = renderHook(useLiveRegion);
  act(() => result.current.announce("a"));
  expect(result.current).toMatchObject({ message: "a", slot: 0 });
  act(() => result.current.announce("a"));
  expect(result.current).toMatchObject({ message: "a", slot: 1 });
});
