import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ComponentProps, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { SegmentedControl } from "./SegmentedControl";

type TSpeed = "1" | "2" | "3";

const options: { value: TSpeed; text: string }[] = [
  { value: "1", text: "1x" },
  { value: "2", text: "2x" },
  { value: "3", text: "3x" },
];

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl<TSpeed>,
  args: { label: "Game speed", options, value: "1", onChange: fn() },
} satisfies Meta<typeof SegmentedControl<TSpeed>>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo(args: ComponentProps<typeof SegmentedControl<TSpeed>>) {
  const [value, setValue] = useState<TSpeed>(args.value);
  return (
    <SegmentedControl
      {...args}
      value={value}
      onChange={(next) => {
        setValue(next);
        args.onChange(next);
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => <Demo {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Game speed" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "1x" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(canvas.getByRole("button", { name: "2x" }));
    await expect(args.onChange).toHaveBeenCalledWith("2");
    await expect(canvas.getByRole("button", { name: "2x" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByRole("button", { name: "1x" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  },
};

export const PressedLooksSelected: Story = {
  render: (args) => <Demo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pressed = getComputedStyle(canvas.getByRole("button", { name: "1x" }));
    const other = getComputedStyle(canvas.getByRole("button", { name: "2x" }));
    await expect(pressed.backgroundColor).not.toBe(other.backgroundColor);
    await expect(pressed.color).not.toBe(other.color);
    await expect(Number.parseFloat(other.backgroundColor.split(",")[3] ?? "1")).toBe(0);
    await expect(getComputedStyle(canvas.getByRole("button", { name: "2x" })).borderLeftWidth).toBe(
      "0px",
    );
  },
};

export const KeyboardFocusNotClipped: Story = {
  render: (args) => <Demo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const option = canvas.getByRole("button", { name: "1x" });
    await expect(option).toHaveFocus();
    const group = canvas.getByRole("group", { name: "Game speed" });
    await expect(getComputedStyle(group).overflow).toBe("hidden");
    const style = getComputedStyle(option);
    await expect(style.outlineStyle).toBe("solid");
    const extent = Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset);
    await expect(extent).toBeLessThanOrEqual(0);
  },
};
