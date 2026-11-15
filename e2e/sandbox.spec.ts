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

test("contains the board and maps pointer movement and clicks to the drawn cell", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/play");
  const application = page.getByRole("application", { name: "Board" });
  const svg = application.getByRole("group", { name: "Home PC board" });
  for (const viewport of [
    { width: 1024, height: 640 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    if (viewport.width === 1280) {
      const panel = page.locator("aside");
      const panelBox = await panel.boundingBox();
      const portBox = await panel.getByRole("group", { name: "Spawn at" }).boundingBox();
      const countBox = await panel.getByRole("group", { name: "Count" }).boundingBox();
      expect(portBox!.width).toBeLessThan(panelBox!.width / 2);
      expect(countBox!.width).toBeLessThan(panelBox!.width / 2);
      await panel.screenshot({ path: "/tmp/sandbox-side-panel.png" });
    }
    const area = await application.boundingBox();
    const drawing = await svg.boundingBox();
    expect(area).not.toBeNull();
    expect(drawing).not.toBeNull();
    expect(drawing!.x).toBeGreaterThanOrEqual(area!.x);
    expect(drawing!.y).toBeGreaterThanOrEqual(area!.y);
    expect(drawing!.x + drawing!.width).toBeLessThanOrEqual(area!.x + area!.width + 1);
    expect(drawing!.y + drawing!.height).toBeLessThanOrEqual(area!.y + area!.height + 1);
    const scale = Math.min(drawing!.width / 992, drawing!.height / 672);
    const x = drawing!.x + (drawing!.width - 992 * scale) / 2 + (6 * 40 + 20 + 16) * scale;
    const y = drawing!.y + (drawing!.height - 672 * scale) / 2 + (6 * 40 + 20 + 16) * scale;
    await page.mouse.move(x, y);
    await expect(application.getByRole("img", { name: "Cell 6, 6" })).toBeVisible();
    await page.getByRole("button", { name: /Antivirus/ }).click();
    await page.mouse.click(x, y);
    await expect(application.getByRole("img", { name: "Antivirus v1.0" })).toBeVisible();
    await page.reload();
  }
});
