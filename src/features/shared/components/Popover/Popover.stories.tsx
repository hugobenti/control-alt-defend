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
