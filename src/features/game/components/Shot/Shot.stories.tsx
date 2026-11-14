import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Board } from "../Board/Board";
import { Tower } from "../Tower/Tower";
import { towerStoryMap } from "../Tower/Tower.stories.data";
import { Shot } from "./Shot";

const meta = {
  title: "Game/Shot",
  component: Shot,
  args: { from: { x: 200, y: 100 }, to: { x: 245, y: 70 } },
  decorators: [
    (Story) => (
      <Board map={towerStoryMap}>
        <Tower type="antivirus" version={2} c={4} r={2} aimAt={{ x: 245, y: 70 }} />
        <Story />
      </Board>
    ),
  ],
} satisfies Meta<typeof Shot>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AntivirusFiring: Story = {};
