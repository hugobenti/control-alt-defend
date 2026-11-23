import { renderHook } from "@testing-library/react";
import type { MouseEvent, PointerEvent } from "react";
import { expect, it, vi } from "vitest";

import { homePc } from "../../level/homePc.data";
import { useBoardInput } from "./useBoardInput";

it("ignores a right-button pointer up and lets contextmenu cancel placement", () => {
  const onActivate = vi.fn();
  const onCancel = vi.fn();
  const { result } = renderHook(() =>
    useBoardInput({ map: homePc, onCell: vi.fn(), onActivate, onCancel }),
  );
  const currentTarget = {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 992, height: 672 }),
  };
  result.current.onPointerUp({
    button: 2,
    clientX: 276,
    clientY: 276,
    currentTarget,
  } as unknown as PointerEvent<HTMLDivElement>);
  expect(onActivate).not.toHaveBeenCalled();
  const preventDefault = vi.fn();
  result.current.onContextMenu({ preventDefault } as unknown as MouseEvent<HTMLDivElement>);
  expect(preventDefault).toHaveBeenCalledOnce();
  expect(onCancel).toHaveBeenCalledOnce();
});

it("clears pointer hover on board leave and outside its playable cells", () => {
  const onCell = vi.fn();
  const { result } = renderHook(() =>
    useBoardInput({ map: homePc, onCell, onActivate: vi.fn(), onCancel: vi.fn() }),
  );
  const currentTarget = {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 992, height: 672 }),
  };
  result.current.onPointerMove({
    clientX: 276,
    clientY: 276,
    currentTarget,
  } as unknown as PointerEvent<HTMLDivElement>);
  expect(onCell).toHaveBeenLastCalledWith({ c: 6, r: 6 });
  result.current.onPointerMove({
    clientX: 2,
    clientY: 2,
    currentTarget,
  } as unknown as PointerEvent<HTMLDivElement>);
  expect(onCell).toHaveBeenLastCalledWith(null);
  result.current.onPointerLeave();
  expect(onCell).toHaveBeenLastCalledWith(null);
  expect(onCell).toHaveBeenCalledTimes(3);
});
