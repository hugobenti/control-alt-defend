import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { FilePips } from "./FilePips";

const meta = {
  title: "Game/FilePips",
  component: FilePips,
  args: { files: ["safe", "safe", "safe", "safe", "safe", "carried", "dropped", "leaked"] },
} satisfies Meta<typeof FilePips>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OneOfEachState: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("5 in the core, 1 carried, 1 dropped, 1 leaked"),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll("svg")).toHaveLength(8);
  },
};

export const AllSafe: Story = {
  args: { files: ["safe", "safe", "safe", "safe"] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("4 in the core, 0 carried, 0 dropped, 0 leaked"),
    ).toBeInTheDocument();
  },
};
