import { expect, test } from "@playwright/test";

test("builds a tower, spawns a worm, and pauses from the board", async ({ page }) => {
  await page.goto("/play");
  await page.getByRole("button", { name: /Antivirus/ }).click();
  const board = page.getByRole("application", { name: "Board" });
  await board.focus();
  await board.press("Enter");
  await expect(board.getByRole("img", { name: "Antivirus v1.0" })).toBeVisible();
  await page.getByRole("button", { name: /^Spawn Worm/ }).click();
  await expect(board.getByRole("img", { name: /^Worm, 100% health/ })).toBeVisible({
    timeout: 2000,
  });
  await board.focus();
  await board.press("Space");
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
});
