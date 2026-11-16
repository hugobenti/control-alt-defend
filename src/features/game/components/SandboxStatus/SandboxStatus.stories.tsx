import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { SandboxStatus } from "./SandboxStatus";

const meta = {
  title: "Game/SandboxStatus",
  component: SandboxStatus,
} satisfies Meta<typeof SandboxStatus>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { enemiesOnBoard: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Sandbox")).toBeInTheDocument();
    await expect(canvas.getByText("Viruses")).toBeInTheDocument();
    await expect(canvas.getByText("0")).toBeInTheDocument();
  },
};

export const TwelveViruses: Story = {
  args: { enemiesOnBoard: 12 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("12")).toBeInTheDocument();
  },
};
