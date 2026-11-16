import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { IMatchHeaderProps } from "./MatchHeader.type";
import { useMatchHeader } from "./useMatchHeader";

const noop = () => {};
const base: IMatchHeaderProps = {
  level: { number: 1, name: "Home PC" },
  progress: null,
  files: ["safe", "safe", "safe", "safe", "safe", "carried", "dropped", "leaked"],
  bits: 214,
  paused: false,
  speed: "1",
  defaultSpeed: "1",
  sound: true,
  settingsOpen: false,
  onPausedChange: noop,
  onSpeedChange: noop,
  onSoundChange: noop,
  onSettingsOpenChange: noop,
  onDefaultSpeedChange: noop,
  onRestart: noop,
  onQuit: noop,
};

function view(patch: Partial<IMatchHeaderProps> = {}) {
  return renderHook(() => useMatchHeader({ ...base, ...patch })).result.current;
}

describe("match header view model", () => {
  it("summarises the files and counts the ones not leaked", () => {
    const result = view();
    expect(result.fileSummary).toBe("5 in the core, 1 carried, 1 dropped, 1 leaked");
    expect(result.filesValue).toBe("7");
    expect(result.filesTotal).toBe("8");
  });

  it("formats level and bits", () => {
    const result = view({ bits: 99999 });
    expect(result.levelPrefix).toBe("Level 1 · ");
    expect(result.levelTitle).toBe("Level 1 · Home PC");
    expect(result.bitsText).toBe("99999");
  });

  it("offers pause while running and resume while paused", () => {
    expect(view().pauseLabel).toBe("Pause");
    expect(view().pauseIcon).toBe("pause");
    expect(view({ paused: true }).pauseLabel).toBe("Resume");
    expect(view({ paused: true }).pauseIcon).toBe("play");
  });

  it("swaps the sound icon", () => {
    expect(view().soundIcon).toBe("sound");
    expect(view({ sound: false }).soundIcon).toBe("sound-off");
  });
});
