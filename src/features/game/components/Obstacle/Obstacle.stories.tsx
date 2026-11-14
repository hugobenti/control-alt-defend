import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Obstacle } from "./Obstacle";

const meta = {
  title: "Game/Obstacle",
  component: Obstacle,
  decorators: [
    (Story) => (
      <svg viewBox="-8 -12 160 130" className="w-64 bg-board">
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof Obstacle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Chip: Story = {
  args: { obstacle: { kind: "chip", c: 0, r: 0, w: 3, h: 2, label: "U1", text: "BIOS" } },
};
export const Capacitor: Story = {
  args: { obstacle: { kind: "capacitor", c: 0, r: 0, w: 1, h: 1, label: "C1" } },
};
export const Resistor: Story = {
  args: { obstacle: { kind: "resistor", c: 0, r: 0, w: 2, h: 1, label: "R1" } },
};
export const Crystal: Story = {
  args: { obstacle: { kind: "crystal", c: 0, r: 0, w: 2, h: 1, label: "Y1" } },
};
