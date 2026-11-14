import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { IMatchHeaderProps } from "./MatchHeader.type";
import { useMatchHeader } from "./useMatchHeader";

const noop = () => {};
const base: IMatchHeaderProps = {
  level: { number: 1, name: "Home PC" },
  wave: { current: 7, total: 20 },
  nextWave: { phase: "break", preview: [{ type: "worm", count: 6 }], secondsLeft: 12 },
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
  onStartNow: noop,
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

  it("formats level, wave and bits", () => {
    const result = view({ bits: 99999, wave: { current: 30, total: 30 } });
    expect(result.levelPrefix).toBe("Level 1 · ");
    expect(result.levelTitle).toBe("Level 1 · Home PC");
    expect(result.waveValue).toBe("30");
    expect(result.waveTotal).toBe("30");
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
