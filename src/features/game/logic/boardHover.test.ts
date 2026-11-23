import { expect, it } from "vitest";

import { boardHover } from "./boardHover";

const towers = [{ c: 6, r: 6 }];
const tower = { c: 6, r: 6 };
const empty = { c: 5, r: 6 };
const core = { c: 11, r: 7 };

it("shows pointer hover and click affordance only over a tower outside placement", () => {
  expect(boardHover(towers, tower, null, "pointer", true)).toEqual({
    showCursor: true,
    showPlacement: false,
    actionable: true,
  });
  for (const cell of [empty, core]) {
    expect(boardHover(towers, cell, null, "pointer", true)).toEqual({
      showCursor: false,
      showPlacement: false,
      actionable: false,
    });
  }
});

it("uses the placement ghost, not a second cursor, for all pointer cells", () => {
  for (const cell of [tower, empty, core]) {
    expect(boardHover(towers, cell, "antivirus", "pointer", true)).toEqual({
      showCursor: false,
      showPlacement: true,
      actionable: false,
    });
  }
});

it("hides pointer marks outside the board, even during placement", () => {
  expect(boardHover(towers, tower, null, "pointer", false).showCursor).toBe(false);
  expect(boardHover(towers, core, "antivirus", "pointer", false).showPlacement).toBe(false);
});

it("keeps the keyboard cursor on every cell, including during placement", () => {
  for (const cell of [tower, empty, core]) {
    expect(boardHover(towers, cell, null, "keyboard", false).showCursor).toBe(true);
    expect(boardHover(towers, cell, "antivirus", "keyboard", false)).toEqual({
      showCursor: true,
      showPlacement: true,
      actionable: false,
    });
  }
});
