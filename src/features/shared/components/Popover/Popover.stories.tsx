import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Popover } from "./Popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  args: { label: "Settings", open: false, onClose: () => {}, children: null },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(true)}>
        Open settings
      </button>
      <Popover label="Settings" open={open} onClose={() => setOpen(false)}>
        <button type="button">First control</button>
      </Popover>
    </div>
  );
}

export const OpensAndClosesWithEscape: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open settings" });
    await expect(canvas.queryByRole("dialog")).toBeNull();
    await userEvent.click(trigger);
    const dialog = canvas.getByRole("dialog", { name: "Settings" });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

function RerenderDemo() {
  const [open, setOpen] = useState(false);
  const [ticks, setTicks] = useState(0);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(true)}>
        Open settings
      </button>
      <button type="button" onClick={() => setTicks(ticks + 1)}>
        Tick {ticks}
      </button>
      <Popover label="Settings" open={open} onClose={() => setOpen(false)}>
        <button type="button">First control</button>
        <button type="button">Second control</button>
      </Popover>
    </div>
  );
}

export const KeepsFocusAcrossRerenders: Story = {
  render: () => <RerenderDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open settings" }));
    const second = canvas.getByRole("button", { name: "Second control" });
    second.focus();
    await expect(second).toHaveFocus();
    // Re-render the parent (new onClose identity) without moving focus.
    canvas
      .getByRole("button", { name: /Tick/ })
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Tick 1" })).toBeInTheDocument());
    await expect(second).toHaveFocus();
  },
};
