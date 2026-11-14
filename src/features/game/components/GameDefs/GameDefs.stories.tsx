import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GameDefs } from "./GameDefs";

const meta = {
  title: "Game/GameDefs",
  component: GameDefs,
  args: {
    ids: {
      glow: "story-glow",
      dots: "story-dots",
      keepout: "story-keepout",
      invalid: "story-invalid",
    },
  },
  decorators: [
    (Story) => (
      <svg viewBox="0 0 80 80" className="w-32">
        <Story />
        <rect width="80" height="80" fill="url(#story-dots)" />
      </svg>
    ),
  ],
} satisfies Meta<typeof GameDefs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Patterns: Story = {};
