import { describe, expect, it } from "vitest";

import { announcementFor } from "./announcements";

describe("announcementFor", () => {
  it("announces file transitions and game over", () => {
    expect(announcementFor({ kind: "stolen", filesInCore: 7 })).toBe(
      "File stolen. 7 files in the core.",
    );
    expect(announcementFor({ kind: "leaked", leaked: 1, total: 8 })).toBe(
      "File leaked. 1 of 8 files lost.",
    );
    expect(announcementFor({ kind: "recovered", filesInCore: 8 })).toBe(
      "File recovered. 8 files in the core.",
    );
    expect(announcementFor({ kind: "gameOver" })).toBe("Game over: every file leaked.");
  });

  it("announces refusal reasons and max version, but not placement", () => {
    expect(announcementFor({ kind: "refused", reason: "keepOut" })).toBe(
      "Can't build on ports, parts or the Core",
    );
    expect(announcementFor({ kind: "refused", reason: "maxVersion" })).toBe("Max version reached.");
    expect(announcementFor({ kind: "placed", towerId: 1 })).toBeNull();
  });
});
