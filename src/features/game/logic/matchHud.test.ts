import { describe, expect, it } from "vitest";

import { countFiles, formatClock } from "./matchHud";

describe("formatClock", () => {
  it("formats seconds as m:ss", () => {
    expect(formatClock(12)).toBe("0:12");
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(75)).toBe("1:15");
  });

  it("rounds up partial seconds and never goes negative", () => {
    expect(formatClock(11.2)).toBe("0:12");
    expect(formatClock(-3)).toBe("0:00");
  });
});

describe("countFiles", () => {
  it("counts each state and the files that have not leaked", () => {
    const counts = countFiles(["safe", "safe", "carried", "dropped", "leaked"]);
    expect(counts.byState).toEqual({ safe: 2, carried: 1, dropped: 1, leaked: 1 });
    expect(counts.notLeaked).toBe(4);
    expect(counts.total).toBe(5);
  });
});
