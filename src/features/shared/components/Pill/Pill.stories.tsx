import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Pill } from "./Pill";

const meta = {
  title: "Components/Pill",
  component: Pill,
  args: { children: "v3.0" },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
