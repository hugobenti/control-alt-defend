import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Port } from "./Port";

const meta = {
  title: "Game/Port",
  component: Port,
  args: { port: { id: "J1", side: "left", start: 2 }, cols: 24, rows: 16 },
  decorators: [
    (Story) => (
      <svg viewBox="-20 55 95 125" className="w-40 bg-board">
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof Port>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Left: Story = {};
export const Right: Story = {
  args: { port: { id: "J2", side: "right", start: 12 } },
  decorators: [
    (Story) => (
      <svg viewBox="885 455 95 125" className="w-40 bg-board">
        <Story />
      </svg>
    ),
  ],
};
