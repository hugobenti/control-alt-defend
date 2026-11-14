import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { DataCore } from "./DataCore";

const meta = {
  title: "Game/DataCore",
  component: DataCore,
  args: { files: 8, filesInCore: 8 },
  decorators: [
    (Story) => (
      <svg viewBox="-52 -52 104 104" className="w-40 bg-board">
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof DataCore>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Full: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: "Core, 8 of 8 files" }),
    ).toBeInTheDocument();
  },
};
export const PartiallyEmpty: Story = {
  args: { filesInCore: 5 },
  play: async ({ canvasElement }) => {
    const core = within(canvasElement).getByRole("img", { name: "Core, 5 of 8 files" });
    await expect(core.querySelectorAll('g[transform="scale(0.75)"]')).toHaveLength(5);
  },
};
export const Empty: Story = {
  args: { filesInCore: 0 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: "Core, 0 of 8 files" }),
    ).toBeInTheDocument();
  },
};
