import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Board } from "../Board/Board";
import { Tower } from "../Tower/Tower";
import { towerStoryMap } from "../Tower/Tower.stories.data";
import { RangeRing } from "./RangeRing";

const meta = {
  title: "Game/RangeRing",
  component: RangeRing,
  args: { type: "antivirus", c: 4, r: 2, range: 3 },
  decorators: [
    (Story) => (
      <Board map={towerStoryMap}>
        <Story />
        <Tower type="antivirus" version={2} c={4} r={2} selected />
      </Board>
    ),
  ],
} satisfies Meta<typeof RangeRing>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SelectedAntivirus: Story = {};
export const DebuggerRange: Story = { args: { type: "debugger", range: 2 } };
export const FirewallRange: Story = { args: { type: "firewall", range: 2 } };
