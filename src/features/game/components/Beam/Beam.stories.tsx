import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

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
export const HorizontalBeam: Story = {
  args: { to: { x: 300, y: 100 } },
  play: async ({ canvasElement }) => {
    const beam = canvasElement.querySelector("g[aria-hidden='true']:has(> line)");
    await expect(beam).not.toBeNull();
    const filter = canvasElement.querySelector("filter");
    await expect(beam?.querySelector("line")).toHaveAttribute("filter", `url(#${filter?.id})`);
    await expect(filter).toHaveAttribute("filterUnits", "userSpaceOnUse");
  },
};
