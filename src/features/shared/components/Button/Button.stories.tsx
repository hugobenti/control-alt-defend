import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Start now", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {([false, true] as const).map((disabled) => (
        <div key={String(disabled)} className="flex flex-wrap items-center gap-3">
          <Button variant="primary" disabled={disabled} shortcut="N">
            Start now
          </Button>
          <Button variant="ghost" disabled={disabled} shortcut="S">
            Sell
          </Button>
          <Button variant="danger" disabled={disabled}>
            Reset run
          </Button>
          <Button variant="primary" size="md" disabled={disabled}>
            Upgrade
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const ClickAndShortcut: Story = {
  args: { shortcut: "N" },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", { name: /Start now/ });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(button.querySelector("kbd")).toHaveTextContent("N");
  },
};

export const DisabledWithReason: Story = {
  args: { disabled: true, describedBy: "reason" },
  render: (args) => (
    <div>
      <Button {...args} />
      <p id="reason">Not enough bits</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Start now" });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAccessibleDescription("Not enough bits");
  },
};
