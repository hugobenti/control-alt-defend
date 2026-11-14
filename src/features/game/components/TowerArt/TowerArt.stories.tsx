import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { TowerArt } from "./TowerArt";

const meta = {
  title: "Game/TowerArt",
  component: TowerArt,
  args: { type: "antivirus", version: 2, className: "size-16" },
} satisfies Meta<typeof TowerArt>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Antivirus: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    await expect(svg).toHaveAttribute("aria-hidden", "true");
    await expect(svg).toHaveAttribute("viewBox", "0 0 40 40");
  },
};
export const Firewall: Story = { args: { type: "firewall", version: 1 } };
export const Debugger: Story = { args: { type: "debugger", version: 3 } };
