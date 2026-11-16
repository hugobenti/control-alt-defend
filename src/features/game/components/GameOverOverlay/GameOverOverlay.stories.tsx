import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { GameOverOverlay } from "./GameOverOverlay";

const meta = {
  title: "Game/GameOverOverlay",
  component: GameOverOverlay,
  args: { open: true, files: 8, onRestart: fn() },
} satisfies Meta<typeof GameOverOverlay>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole("dialog", { name: "Game over" });
    const restart = within(dialog).getByRole("button", { name: "Restart" });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(within(dialog).getByText("All 8 files leaked.")).toBeInTheDocument();
    await expect(restart).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(dialog).toBeInTheDocument();
    await expect(args.onRestart).not.toHaveBeenCalled();
    await userEvent.click(restart);
    await expect(args.onRestart).toHaveBeenCalledTimes(1);
  },
};

export const Closed: Story = {
  args: { open: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("dialog")).not.toBeInTheDocument();
  },
};
