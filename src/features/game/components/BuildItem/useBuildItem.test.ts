import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { IBuildItemProps } from "./BuildItem.type";
import { useBuildItem } from "./useBuildItem";

const base: IBuildItemProps = { type: "debugger", cost: 90, shortcut: "3", state: "available" };

function view(patch: Partial<IBuildItemProps>) {
  return renderHook(() => useBuildItem({ ...base, ...patch })).result.current;
}

describe("build item view model", () => {
  it("shows the tower role and stays enabled when available", () => {
    const result = view({});
    expect(result.subtitle).toBe("Ramping beam, beats armor");
    expect(result.disabled).toBe(false);
    expect(result.pressed).toBe(false);
  });

  it("is pressed with a cancel hint while placing", () => {
    const result = view({ state: "placing" });
    expect(result.pressed).toBe(true);
    expect(result.disabled).toBe(false);
    expect(result.subtitle).toBe("Click a cell · Esc cancels");
  });

  it("is disabled and says how many bits are missing when poor", () => {
    const result = view({ state: "poor", missingBits: 12 });
    expect(result.disabled).toBe(true);
    expect(result.subtitle).toBe("Need 12 more bits");
    expect(result.showCost).toBe(true);
  });

  it("is disabled, costless and points to the lab when locked", () => {
    const result = view({ state: "locked" });
    expect(result.disabled).toBe(true);
    expect(result.showCost).toBe(false);
    expect(result.subtitle).toBe("Unlock in the Upgrade lab");
    expect(result.describedBy).toBe(result.subtitleId);
  });
});
