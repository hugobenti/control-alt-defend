import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FileToken } from "./FileToken";

const meta = {
  title: "Game/FileToken",
  component: FileToken,
  args: { state: "inCore" },
  decorators: [
    (Story) => (
      <svg viewBox="-12 -12 80 65" className="w-40 bg-board">
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof FileToken>;
export default meta;
type Story = StoryObj<typeof meta>;
export const InCore: Story = {};
export const Dropped: Story = { args: { state: "dropped" } };
