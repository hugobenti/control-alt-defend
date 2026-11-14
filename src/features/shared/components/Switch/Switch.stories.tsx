import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ComponentProps, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Switch } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: { label: "Sound", checked: true, onChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo(args: ComponentProps<typeof Switch>) {
  const [checked, setChecked] = useState(args.checked);
  return (
    <Switch
      {...args}
      checked={checked}
      onChange={(next) => {
        setChecked(next);
        args.onChange(next);
      }}
    />
  );
}

export const Toggles: Story = {
  render: (args) => <Demo {...args} />,
  play: async ({ canvasElement, args }) => {
    const toggle = within(canvasElement).getByRole("switch", { name: "Sound" });
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await expect(args.onChange).toHaveBeenLastCalledWith(false);
    toggle.focus();
    await userEvent.keyboard(" ");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenLastCalledWith(true);
  },
};

export const Off: Story = {
  args: { checked: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("switch", { name: "Sound" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  },
};
