import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Stat } from "./Stat";

const meta = {
  title: "Components/Stat",
  component: Stat,
  args: { label: "Wave", value: "7" },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTotal: Story = {
  args: { total: "30" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Wave")).toBeInTheDocument();
    await expect(canvas.getByText("7")).toBeInTheDocument();
    await expect(canvas.getByText("/ 30")).toBeInTheDocument();
  },
};

export const WithoutTotal: Story = {
  args: { label: "Bits", value: "99999" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText(/^\//)).toBeNull();
  },
};
