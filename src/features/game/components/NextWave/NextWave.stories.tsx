import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { NextWave } from "./NextWave";

const meta = {
  title: "Game/NextWave",
  component: NextWave,
  args: {
    phase: "break",
    wave: 7,
    preview: [
      { type: "worm", count: 6 },
      { type: "rootkit", count: 2 },
    ],
    secondsLeft: 12,
    earlyBonus: 6,
    onStartNow: fn(),
  },
} satisfies Meta<typeof NextWave>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Break: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("in 0:12")).toBeInTheDocument();
    await expect(canvas.getByText("6 Worms")).toBeInTheDocument();
    await expect(canvas.getByText("2 Rootkits")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: /Start now/ }));
    await expect(args.onStartNow).toHaveBeenCalledTimes(1);
  },
};

export const Running: Story = {
  args: { phase: "running", virusesLeft: 9, secondsLeft: undefined, earlyBonus: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Wave 7 running")).toBeInTheDocument();
    await expect(canvas.getByText("9 viruses left")).toBeInTheDocument();
    await expect(canvas.queryByRole("button")).toBeNull();
  },
};
