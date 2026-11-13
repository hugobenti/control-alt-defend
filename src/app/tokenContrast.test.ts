import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "vitest";

import { contrastRatio, readThemeColors } from "@/features/shared/utils/colorContrast";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const tokens = readThemeColors(css);

const TOKEN_NAMES = [
  "accent",
  "accent-hover",
  "antivirus",
  "bg",
  "board",
  "copper",
  "copper-dim",
  "danger",
  "data",
  "debugger",
  "firewall",
  "focus",
  "fg",
  "frame",
  "line",
  "muted",
  "on-accent",
  "raised",
  "rootkit",
  "surface",
  "worm",
];

function ratio(foreground: string, background: string): number {
  const fg = tokens[foreground];
  const bg = tokens[background];
  if (!fg || !bg) {
    throw new Error(`missing color token: ${!fg ? foreground : background}`);
  }
  return contrastRatio(fg, bg);
}

function pairs(foregrounds: string[], backgrounds: string[]): Array<[string, string]> {
  return foregrounds.flatMap((fg) => backgrounds.map((bg): [string, string] => [fg, bg]));
}

// Text pairs need 4.5:1, graphics (focus ring, game pieces) 3:1. Add every new pair a component uses.
const textPairs = [
  ...pairs(["fg", "muted"], ["bg", "surface", "raised"]),
  ...pairs(["on-accent"], ["accent", "accent-hover"]),
  ...pairs(["data", "danger", "debugger", "firewall"], ["surface", "raised"]),
];

const graphicPairs = [
  ...pairs(["focus"], ["bg", "surface"]),
  ...pairs(
    ["copper", "firewall", "antivirus", "debugger", "worm", "rootkit", "data", "danger", "fg"],
    ["board"],
  ),
];

test("declares exactly the game palette", () => {
  expect(Object.keys(tokens).sort()).toEqual([...TOKEN_NAMES].sort());
});

test.each(textPairs)("text %s on %s ≥ 4.5:1", (foreground, background) => {
  expect(ratio(foreground, background)).toBeGreaterThanOrEqual(4.5);
});

test.each(graphicPairs)("graphic %s on %s ≥ 3:1", (foreground, background) => {
  expect(ratio(foreground, background)).toBeGreaterThanOrEqual(3);
});

test("has no dark-scheme override block", () => {
  expect(css).not.toMatch(/prefers-color-scheme/);
});
