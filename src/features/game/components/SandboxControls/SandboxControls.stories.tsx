import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { SandboxControls } from "./SandboxControls";

const meta = {
  title: "Game/SandboxControls",
  component: SandboxControls,
  args: {
    port: "J1",
    ports: [
      { value: "J1", text: "J1" },
      { value: "J2", text: "J2" },
    ],
    count: "1",
    onPortChange: fn(),
    onCountChange: fn(),
    onSpawn: fn(),
    onGrantBits: fn(),
  },
} satisfies Meta<typeof SandboxControls>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const section = canvas.getByRole("region", { name: "Sandbox" });
    await expect(within(section).getByRole("group", { name: "Spawn at" })).toBeInTheDocument();
    await expect(within(section).getByRole("group", { name: "Count" })).toBeInTheDocument();
    await expect(within(section).getByText("Spawn at")).toHaveAttribute("aria-hidden", "true");
    await expect(within(section).getByText("Count")).toHaveAttribute("aria-hidden", "true");
    await userEvent.click(within(section).getByRole("button", { name: /Spawn Worm/ }));
    await expect(args.onSpawn).toHaveBeenCalledWith("worm");
    await userEvent.click(within(section).getByRole("button", { name: "J2" }));
    await expect(args.onPortChange).toHaveBeenCalledWith("J2");
    await userEvent.click(within(section).getByRole("button", { name: "5" }));
    await expect(args.onCountChange).toHaveBeenCalledWith("5");
    await userEvent.click(within(section).getByRole("button", { name: /Spawn Rootkit/ }));
    await expect(args.onSpawn).toHaveBeenCalledWith("rootkit");
    await userEvent.click(within(section).getByRole("button", { name: /1000 bits/ }));
    await expect(args.onGrantBits).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardOrder: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of ["J1", "J2", "1", "5", /Spawn Worm/, /Spawn Rootkit/, /1000 bits/]) {
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name })).toHaveFocus();
    }
  },
};

export const RepeatedSections: Story = {
  render: (args) => (
    <>
      <SandboxControls {...args} />
      <div hidden>
        <SandboxControls {...args} />
      </div>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstSection = canvas.getByRole("region", { name: "Sandbox" });
    const secondSection = canvasElement.querySelector("div[hidden] section");
    const firstHeading = within(firstSection).getByRole("heading", { name: "Sandbox" });
    const secondHeading = secondSection?.querySelector("h2");
    await expect(secondHeading).toBeTruthy();
    await expect(firstHeading.id).not.toBe(secondHeading?.id);
    await expect(firstSection).toHaveAttribute("aria-labelledby", firstHeading.id);
    await expect(secondSection).toHaveAttribute("aria-labelledby", secondHeading?.id);
  },
};
