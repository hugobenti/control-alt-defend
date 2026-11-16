import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { HomeScreen } from "./HomeScreen";

const meta = {
  title: "Home/HomeScreen",
  component: HomeScreen,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof HomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Play: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Play" })).toHaveAttribute("href", "/play");
    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  },
};
