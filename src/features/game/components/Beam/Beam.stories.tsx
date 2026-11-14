import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Board } from "../Board/Board";
import { Tower } from "../Tower/Tower";
import { towerStoryMap } from "../Tower/Tower.stories.data";
import { Beam } from "./Beam";

const meta = {
  title: "Game/Beam",
  component: Beam,
  args: { from: { x: 180, y: 100 }, to: { x: 300, y: 120 }, ramp: 0.25 },
  decorators: [
    (Story) => (
      <Board map={towerStoryMap}>
        <Tower type="debugger" version={2} c={4} r={2} />
        <Story />
      </Board>
    ),
  ],
} satisfies Meta<typeof Beam>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ramping: Story = {};
export const FullRamp: Story = { args: { ramp: 1 } };
