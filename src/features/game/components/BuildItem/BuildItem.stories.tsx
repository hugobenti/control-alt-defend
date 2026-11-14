import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { BuildItem } from "./BuildItem";

const meta = {
  title: "Game/BuildItem",
  component: BuildItem,
  args: { type: "firewall", cost: 10, shortcut: "1", state: "available", onSelect: fn() },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BuildItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {
  play: async ({ canvasElement, args }) => {
    const item = within(canvasElement).getByRole("button", { name: /^Firewall/ });
    await expect(item).toHaveAccessibleDescription(/Wall; boosts towers next to it/);
    await expect(item).toHaveAccessibleDescription(/10 bits/);
    await userEvent.click(item);
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
  },
};

export const Placing: Story = {
  args: { type: "antivirus", cost: 40, shortcut: "2", state: "placing" },
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole("button", { name: /^Antivirus/ });
    await expect(item).toHaveAttribute("aria-pressed", "true");
    await expect(item).toHaveAccessibleDescription(/Click a cell · Esc cancels/);
  },
};

export const NotEnoughBits: Story = {
  args: { type: "debugger", cost: 90, shortcut: "3", state: "poor", missingBits: 12 },
  play: async ({ canvasElement, args }) => {
    const item = within(canvasElement).getByRole("button", { name: /^Debugger/ });
    await expect(item).toBeDisabled();
    await expect(item).toHaveAccessibleDescription(/Need 12 more bits/);
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
};

export const LockedInLab: Story = {
  args: { type: "debugger", cost: 90, shortcut: "3", state: "locked" },
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole("button", { name: /^Debugger/ });
    await expect(item).toBeDisabled();
    await expect(item).toHaveAccessibleDescription("Unlock in the Upgrade lab");
  },
};
