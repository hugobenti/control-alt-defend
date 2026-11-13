import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { IconButton } from "./IconButton";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  args: { icon: "pause", label: "Pause", onClick: fn() },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pause" });
    await expect(button).not.toHaveAttribute("aria-pressed");
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Pressed: Story = {
  args: { icon: "sound-off", label: "Mute", pressed: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Mute" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const NotPressed: Story = {
  args: { icon: "sound", label: "Mute", pressed: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Mute" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  },
};
