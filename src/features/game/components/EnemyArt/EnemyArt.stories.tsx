import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { EnemyArt } from "./EnemyArt";

const meta = {
  title: "Game/EnemyArt",
  component: EnemyArt,
  args: { type: "worm", className: "size-16" },
} satisfies Meta<typeof EnemyArt>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Worm: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    await expect(svg).toHaveAttribute("aria-hidden", "true");
    await expect(svg).toHaveAttribute("viewBox", "-20 -20 40 40");
  },
};
export const Rootkit: Story = { args: { type: "rootkit" } };
